const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(bodyParser.json());
const port = 3000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://3iotpfe:FEDOBFkiKrf0JTFo@dashpoultry.igiqe9n.mongodb.net/dashpoultry')
  .then(() => console.log("Connexion à MongoDB réussie."))
  .catch(err => console.error("Échec de la connexion à MongoDB", err));
 

  const ActionStateSchema = new mongoose.Schema({
    automatic: Boolean,
    lampOn: Boolean,
    fanOn: Boolean,
    heaterOn: Boolean,
    startDateOfProduction: Date,
    organizationName: String,
  }, { collection: 'action' });
  
  const ActionState = mongoose.model('ActionState', ActionStateSchema);
// Schéma pour les utilisateurs
const userSchema = new mongoose.Schema({
  username: String,
  firstName: String,
  lastName: String,
  organizationName: String,
  location: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phoneNumber: String
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

const User = mongoose.model('User', userSchema);


// Définition du schéma pour la collection 'datasensor'
const DataSchema = new mongoose.Schema({
  date: Date,
  temperature: Number,
  nh3: Number,
  co2: Number,
  luminosity: Number,
  humidity: Number,
  dust: Number,
  water: Number,
  fooder: Number
}, { collection: 'datasensor' });
// Schéma pour la collection 'notifications'

const NotificationSchema = new mongoose.Schema({
  date: Date,
  message: String,
  email:String,
  read: Boolean,
  id:String
}, { 
  collection: 'notification',
});
const Notification = mongoose.model('Notification', NotificationSchema);

// Modèle Mongoose pour les données du capteur
const SensorDataSchema = new mongoose.Schema({
  temperature: Number,
  humidity: Number,
  co2: Number,
  nh3: Number,
  dust: Number,
  luminosity: Number,
  water: Number,
  fodder: Number,
  date: Date
});
const SenssorData = mongoose.model('SenssorData', DataSchema);



const SensorData = mongoose.model('SensorData', DataSchema);
// Point d'entrée API pour recevoir les données
app.post('/sensor-data', (req, res) => {
  const data = new SenssorData(req.body);
  data.save()
    .then((doc) => {
      res.status(201).send(doc);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});
const actionSchema = new mongoose.Schema({
  automatic: Boolean,
  lampOn: Boolean,
  heaterOn: Boolean,
  fanOn: Boolean,
  startDateOfProduction: Date,
  organizationName: String
}, { collection: 'action' });

const Action = mongoose.model('Action', actionSchema);

app.get('/api/actions/:organizationName', async (req, res) => {
  try {
    const { organizationName } = req.params;
    const action = await Action.findOne({ organizationName });

    if (!action) {
      return res.status(404).send({ message: 'Organization not found' });
    }

    res.status(200).send({
      automatic: action.automatic,
      lampOn: action.lampOn,
      heaterOn: action.heaterOn,
      fanOn: action.fanOn,
      startDateOfProduction: action.startDateOfProduction
    });
  } catch (error) {
    res.status(500).send({ message: 'Server error', error: error });
  }
});

// Endpoint pour obtenir les données des capteurs agrégées par heure pour une date spécifique et par organisation
app.get('/api/sensor-data-hourly/:date/:organizationName', async (req, res) => {
  const { date, organizationName } = req.params;
  console.log(date);
  try {
    // Définir la date de début et de fin pour couvrir toutes les heures de la journée spécifiée
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(startDate.getDate() + 1);

    // Agréger les données par heure en utilisant MongoDB aggregation framework
    const sensorData = await SensorData.aggregate([
      {
        $match: {
          date: {
            $gte: startDate,
            $lt: endDate
          },
          organizationName: organizationName  // Filtre supplémentaire par nom d'organisation
        }
      },
      {
        $project: {
          year: { $year: "$date" },
          month: { $month: "$date" },
          day: { $dayOfMonth: "$date" },
          hour: { $hour: "$date" },
          temperature: 1,
        }
      },
      {
        $group: {
          _id: {
            year: "$year",
            month: "$month",
            day: "$day",
            hour: "$hour"
          },
          avgTemperature: { $avg: "$temperature" },
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ]);

    if (sensorData.length === 0) {
      return res.status(404).json({ message: 'Aucune donnée trouvée pour cette date et organisation' });
    }
    res.json(sensorData);
  } catch (error) {
    console.error('Erreur lors de la récupération des données des capteurs:', error);
    res.status(500).send('Erreur serveur');
  }
});



app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && bcrypt.compareSync(password, user.password)) {
      userDetails.email=user.email;
      res.status(200).json({ message: 'Login successful' });

    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

const userDetails = {
  email: ''
};


// API endpoint to get the email
app.get('/get-email', (req, res) => {
  
  res.json({ email: userDetails.email });
});

app.get('/api/users/:email', async (req, res) => {  // Added :email to capture email from the route
  try {
    const userEmail = req.params.email; // Correctly captures email from the URL parameter
    const user = await User.findOne({ email: userEmail });  // Use email directly in your query
    
    if (!user) {
      return res.status(404).send('Utilisateur non trouvé');
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
  }
});
const nodemailer = require('nodemailer');

// Créez un transporter pour Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // Utilisez le service de messagerie de votre choix
  auth: {
    user: 'fedisghair323@gmail.com', // Votre adresse email
    pass: 'yclv ralo rzsk qcpt' // Votre mot de passe email
  }
});

// Fonction pour envoyer un email
function sendDangerAlert(email, message) {
  const mailOptions = {
    from: 'fedisghair323@gmail.com',
    to: email,
    subject: 'Alerte de condition dangereuse détectée!',
    text: message
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log('Erreur lors de l\'envoi de l\'email: ', error);
    } else {
      console.log('Email envoyé: ' + info.response);
    }
  });
}


app.get('/api/check-notification/:email/:id', async (req, res) => {
  const { email, id } = req.params;

  try {
    const notification = await Notification.findOne({ id: id, email: email }); // Assuming 'email' is the correct field name in your schema

    if (notification) {
      res.json({ exists: true, notification: notification });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.post('/api/newnotification', async (req, res) => {
  try {
    const { date, message, email, read, id } = req.body;
    const notification = new Notification({
      date,
      message,
      email,
      read,
      id
    });
    sendDangerAlert(notification.email, notification.message);
    const savedNotification = await notification.save();
    res.status(201).json(savedNotification);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(400).json({ message: "Erreur lors de la création de la notification", error: error.message });
  }
});

// Fonction pour récupérer toutes les notifications pour un email spécifique, triées par date
app.get('/api/notifications/:email', async (req, res) => {
  const email = req.params.email; // Récupération de l'email à partir du chemin de l'URL
  try {
    const allNotifications = await Notification.find({email:email}).sort({ date: -1 });
    if (!allNotifications || allNotifications.length === 0) {
      return res.status(404).json({ message: "Aucune notification trouvée pour cet email" });
    }
    res.json(allNotifications);
  } catch (error) {
    console.error("Erreur lors de la récupération des notifications pour l'email:", error);
    res.status(500).json({ message: "Erreur lors de la récupération des données de notification" });
  }
});

app.delete('/notifications/:email/:id', async (req, res) => {
  try {
    const { id, email } = req.params;
    if (!id || !email) {
      return res.status(400).send('Notification ID and Email are required');
    }

    // Assuming the 'email' field in the notification document holds the user's email
    const deletedNotification = await Notification.findOneAndDelete({ _id: id, email: email });

    if (!deletedNotification) {
      return res.status(404).send('Notification not found with the provided ID and Email');
    }
    res.send('Notification deleted successfully');
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

// Signup route
app.post('/signup', async (req, res) => {
  try {
    const user = new User({
      username: req.body.username,
      firstName: req.body.firstname,  // Changed from firstname to match typical naming
      lastName: req.body.lastname,    // Changed from lastname
      phoneNumber: req.body.tel,
      location: req.body.location,
      email: req.body.email,
      password: req.body.password,
      organizationName: req.body.organisation, // Changed from organisation to organizationName
    });

    await user.save();
    res.status(201).send({ message: 'User created successfully', userId: user._id });
  } catch (error) {
    res.status(400).send({ message: 'Error creating user', error: error.message });
  }
});

app.post('/api/update-state/:organizationName', async (req, res) => {
  const { organizationName } = req.params;
  const newState = req.body;
  try {
    await ActionState.findOneAndUpdate({ organizationName }, newState, { new: true });
    res.status(200).send('State updated successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});
// Endpoint pour récupérer le nom de l'organisation par email
app.get('/api/organization-name/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ organizationName: user.organizationName });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching organization name', error: error.message });
  }
});

app.post('/api/update-user/:email', async (req, res) => {
  try {
      const { email } = req.params;
      const updateData = req.body;
      const updatedUser = await User.findOneAndUpdate(
          { email: email },
          { $set: updateData },
          { new: true }  // Returns the updated document
      );

      if (!updatedUser) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.json({ message: 'User updated successfully', data: updatedUser });
  } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Error updating user details' });
  }
});


// Endpoint pour récupérer l'état initial par nom de l'organisation
app.get('/api/get-latest-state/:organizationName', async (req, res) => {
  try {
    const state = await ActionState.findOne({ organizationName: req.params.organizationName });
    if (!state) return res.status(404).json({ message: 'State not found' });
    res.json(state);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching state', error: error.message });
  }
});


app.get('/api/environmental-data', async (req, res) => {
  try {
    const latestData = await SensorData.findOne().sort({ date: -1 }).exec();
    if (!latestData) {
      return res.status(404).send('No environmental data found');
    }

    res.json({
      temperature: latestData.temperature,
      humidity: latestData.humidity,
      co2: latestData.co2,
      nh3: latestData.nh3,
      dust: latestData.dust,
      luminosity: latestData.luminosity
    });
  } catch (error) {
    console.error('Error fetching environmental data:', error);
    res.status(500).send('Server error');
  }
});

// Fonction générique pour récupérer et envoyer les dernières données pour un type spécifique de capteur


async function fetchLatestData(req, res, dataType) {
  try {
    let organizationName = req.params.organizationName; // Récupère le nom de l'organisation depuis les paramètres de l'URL
    let selectionObject = { date: 1 };
    selectionObject[dataType] = 1;

    // Ajoute un filtre pour rechercher les données selon l'organizationName
    const latestData = await SensorData.findOne({ organizationName: organizationName }, selectionObject).sort({ date: -1 });
    if (!latestData) {
      return res.status(404).json({ message: `Aucune donnée trouvée pour ${dataType} chez ${organizationName}` });
    }
    res.json({ [dataType]: latestData[dataType], date: latestData.date });
  } catch (error) {
    console.error(`Erreur lors de la récupération des données pour ${dataType} chez ${organizationName}:`, error);
    res.status(500).json({ message: `Erreur lors de la récupération des données pour ${dataType} chez ${organizationName}` });
  }
}

// Création d'un endpoint pour la température filtrée par le nom de l'organisation
app.get('/api/temperature/:organizationName', (req, res) => fetchLatestData(req, res, 'temperature'));


// Création d'endpoints pour chaque type de données
app.get('/api/nh3/:organizationName', (req, res) => fetchLatestData(req, res, 'nh3'));
app.get('/api/co2/:organizationName', (req, res) => fetchLatestData(req, res, 'co2'));
app.get('/api/luminosity/:organizationName', (req, res) => fetchLatestData(req, res, 'luminosity'));
app.get('/api/humidity/:organizationName', (req, res) => fetchLatestData(req, res, 'humidity'));
app.get('/api/dust/:organizationName', (req, res) => fetchLatestData(req, res, 'dust'));
app.get('/api/water/:organizationName', (req, res) => fetchLatestData(req, res, 'water'));
app.get('/api/fooder/:organizationName', (req, res) => fetchLatestData(req, res, 'fooder'));
// Fonction pour récupérer et envoyer toutes les données de température, triées par date

app.get('/api/temperatures/5min/:organizationName', async (req, res) => {
  const organization = req.params.organizationName; // Récupérer le nom de l'organisation depuis les paramètres de l'URL

  try {
    const allTemperatures = await SensorData.find({ organizationName: organization }, { temperature: 1, date: 1 })
                                             .sort({ date: -1 });
    if (!allTemperatures || allTemperatures.length === 0) {
      return res.status(404).json({ message: "Aucune donnée de température trouvée" });
    }
    res.json(allTemperatures.map(entry => ({ date: entry.date, temperature: entry.temperature })));
  } catch (error) {
    console.error("Erreur lors de la récupération de toutes les températures:", error);
    res.status(500).json({ message: "Erreur lors de la récupération des données de température" });
  }
});


app.get('/api/temperatures/week/:organizationName', async (req, res) => {
  const organization = req.params.organizationName;

  try {
    const weeklyTemperatures = await SensorData.aggregate([ { $match: { organizationName: organization } },
      {
        // Convertir la chaîne de date en objet Date sans spécifier le format
        $addFields: {
          convertedDate: {
            $dateFromString: {
              dateString: "$date"
              // Format supprimé pour utiliser la reconnaissance automatique de la norme ISO 8601
            }
          }
        }
      },
      {
        // Préparer les champs pour le groupement
        $project: {
          week: { $week: "$convertedDate" }, // Utiliser convertedDate qui est maintenant un objet Date
          year: { $year: "$convertedDate" },
          temperature: 1,
          date: 1 // Ce champ n'est plus nécessaire pour les opérations de groupe mais peut être utile pour la sortie
        }
      },
      {
        // Grouper les données par année et semaine
        $group: {
          _id: { year: "$year", week: "$week" },
          temperature: { $last: "$temperature" },
          date: { $last: "$convertedDate" }
        }
      },
      {
        // Trier les résultats par année et numéro de semaine
        $sort: { "_id.year": 1, "_id.week": 1 }
      },
      {
        // Choisir les champs à inclure dans les résultats finaux
        $project: {
          _id: 0,
          year: "$_id.year",
          week: "$_id.week",
          temperature: 1,
          date: 1 // Vous pouvez choisir de convertir cela en chaîne si nécessaire
        }
      }
    ]);

    if (!weeklyTemperatures || weeklyTemperatures.length === 0) {
      return res.status(404).json({ message: "Aucune donnée de température trouvée par semaine" });
    }

    res.json(weeklyTemperatures);
  } catch (error) {
    console.error("Erreur lors de la récupération des températures par semaine:", error);
    res.status(500).json({ message: "Erreur lors de la récupération des températures par semaine" });
  }
});

app.get('/api/temperatures/day/:organizationName', async (req, res) => {
  const organization = req.params.organizationName;

  try {
    const temperaturesByDay = await SensorData.aggregate([ { $match: { organizationName: organization } },
      {
        // Étape 1: Convertir la date en format 'année-mois-jour'
        $project: {
          date: { $toDate: "$date" },
          temperature: 1
        }
      },
      {
        // Étape 2: Trier par date en ordre ascendant pour préparer le groupement
        $sort: { date: 1 }
      },
      {
        // Étape 3: Grouper par la date convertie et prendre la première température
        $group: {
          _id: "$date",
          temperature: { $first: "$temperature" }
        }
      },
      {
        // Étape 4: Trier par l'identifiant de groupe (_id), qui est la date, si nécessaire
        $sort: { _id: 1 }
      },
      {
        // Étape 5: Reformater la sortie
        $project: {
          _id: 0,
          date: "$_id",
          temperature: 1
        }
      }
    ]);

    if (!temperaturesByDay || temperaturesByDay.length === 0) {
      return res.status(404).json({ message: "Aucune donnée de température trouvée pour chaque jour" });
    }

    res.json(temperaturesByDay);
  } catch (error) {
    console.error("Erreur lors de la récupération des températures par jour:", error);
    res.status(500).json({ message: "Erreur lors de la récupération des températures par jour" });
  }
});



// Fonction pour récupérer et envoyer toutes les données d'humidité, triées par date
// API pour obtenir les données d'humidité hebdomadaire pour une organisation spécifique
app.get('/api/humidities/week/:organizationName', async (req, res) => {
  const organization = req.params.organizationName;

  try {
    const weeklyHumidities = await SensorData.aggregate([
      { $match: { organizationName: organization } },
      {
        $addFields: {
          convertedDate: {
            $dateFromString: {
              dateString: "$date"
            }
          }
        }
      },
      {
        $project: {
          week: { $week: "$convertedDate" },
          year: { $year: "$convertedDate" },
          humidity: 1,
          date: 1
        }
      },
      {
        $group: {
          _id: { year: "$year", week: "$week" },
          humidity: { $last: "$humidity" },
          date: { $last: "$convertedDate" }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.week": 1 }
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          week: "$_id.week",
          humidity: 1,
          date: 1
        }
      }
    ]);

    if (!weeklyHumidities || weeklyHumidities.length === 0) {
      return res.status(404).json({ message: "No weekly humidity data found" });
    }
    res.json(weeklyHumidities);
  } catch (error) {
    console.error("Error retrieving weekly humidities:", error);
    res.status(500).json({ message: "Error retrieving weekly humidity data" });
  }
});

// API pour obtenir les données d'humidité quotidienne pour une organisation spécifique
app.get('/api/humidities/day/:organizationName', async (req, res) => {
  const organization = req.params.organizationName;

  try {
    const humiditiesByDay = await SensorData.aggregate([
      { $match: { organizationName: organization } },
      {
        $project: {
          date: { $toDate: "$date" },
          humidity: 1
        }
      },
      {
        $sort: { date: 1 }
      },
      {
        $group: {
          _id: "$date",
          humidity: { $first: "$humidity" }
        }
      },
      {
        $sort: { _id: 1 }
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          humidity: 1
        }
      }
    ]);

    if (!humiditiesByDay || humiditiesByDay.length === 0) {
      return res.status(404).json({ message: "No daily humidity data found" });
    }
    res.json(humiditiesByDay);
  } catch (error) {
    console.error("Error retrieving daily humidities:", error);
    res.status(500).json({ message: "Error retrieving daily humidity data" });
  }
});

// API pour obtenir toutes les données d'humidité toutes les 5 minutes pour une organisation spécifique
app.get('/api/humidities/5min/:organizationName', async (req, res) => {
  const organization = req.params.organizationName;

  try {
    const allHumidities = await SensorData.find({ organizationName: organization }, { humidity: 1, date: 1 })
                                           .sort({ date: -1 });
    if (!allHumidities || allHumidities.length === 0) {
      return res.status(404).json({ message: "No humidity data found" });
    }
    res.json(allHumidities.map(entry => ({ date: entry.date, humidity: entry.humidity })));
  } catch (error) {
    console.error("Error retrieving all humidities:", error);
    res.status(500).json({ message: "Error retrieving humidity data" });
  }
});

// Fonction pour récupérer et envoyer toutes les données de NH3, triées par date

// API to fetch NH3 data every 5 minutes for a specific organization
app.get('/api/nh3s/5min/:organizationName', async (req, res) => {
  const organization = req.params.organizationName;

  try {
    const nh3Data = await SensorData.find({ organizationName: organization }, { nh3: 1, date: 1 })
                                    .sort({ date: -1 });
    if (!nh3Data || nh3Data.length === 0) {
      return res.status(404).json({ message: "No NH3 data found" });
    }
    res.json(nh3Data.map(entry => ({ date: entry.date, nh3: entry.nh3 })));
  } catch (error) {
    console.error("Error retrieving NH3 data:", error);
    res.status(500).json({ message: "Error retrieving NH3 data" });
  }
});

// API to fetch daily NH3 data for a specific organization
app.get('/api/nh3s/day/:organizationName', async (req, res) => {
  const organization = req.params.organizationName;

  try {
    const nh3ByDay = await SensorData.aggregate([
      { $match: { organizationName: organization } },
      {
        $project: {
          date: { $toDate: "$date" },
          nh3: 1
        }
      },
      {
        $sort: { date: 1 }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          nh3: { $avg: "$nh3" }
        }
      },
      {
        $sort: { _id: 1 }
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          nh3: 1
        }
      }
    ]);

    if (!nh3ByDay || nh3ByDay.length === 0) {
      return res.status(404).json({ message: "No daily NH3 data found" });
    }
    res.json(nh3ByDay);
  } catch (error) {
    console.error("Error retrieving daily NH3:", error);
    res.status(500).json({ message: "Error retrieving daily NH3 data" });
  }
});

// API to fetch weekly NH3 data for a specific organization
app.get('/api/nh3s/week/:organizationName', async (req, res) => {
  const organization = req.params.organizationName;

  try {
    const weeklyNh3 = await SensorData.aggregate([
      { $match: { organizationName: organization } },
      {
        $addFields: {
          convertedDate: {
            $dateFromString: {
              dateString: "$date"
            }
          }
        }
      },
      {
        $project: {
          week: { $week: "$convertedDate" },
          year: { $year: "$convertedDate" },
          nh3: 1
        }
      },
      {
        $group: {
          _id: { year: "$year", week: "$week" },
          nh3: { $avg: "$nh3" },
          date: { $last: "$convertedDate" }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.week": 1 }
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          week: "$_id.week",
          nh3: 1,
          date: 1
        }
      }
    ]);

    if (!weeklyNh3 || weeklyNh3.length === 0) {
      return res.status(404).json({ message: "No weekly NH3 data found" });
    }
    res.json(weeklyNh3);
  } catch (error) {
    console.error("Error retrieving weekly NH3:", error);
    res.status(500).json({ message: "Error retrieving weekly NH3 data" });
  }
});

// Fonction pour récupérer et envoyer toutes les données de CO2, triées par date
// API to fetch CO2 data every 5 minutes for a specific organization
app.get('/api/co2s/5min/:organizationName', async (req, res) => {
  const organization = req.params.organizationName;

  try {
    const recentCo2 = await SensorData.find({ organizationName: organization }, { co2: 1, date: 1 })
                                      .sort({ date: -1 })
                                      .limit(12); // Assuming data is collected every 5 minutes
    if (!recentCo2 || recentCo2.length === 0) {
      return res.status(404).json({ message: "No recent CO2 data found" });
    }
    res.json(recentCo2.map(entry => ({ date: entry.date, co2: entry.co2 })));
  } catch (error) {
    console.error("Error retrieving recent CO2 data:", error);
    res.status(500).json({ message: "Error retrieving recent CO2 data" });
  }
});

// API to fetch daily CO2 data for a specific organization
app.get('/api/co2s/day/:organizationName', async (req, res) => {
  const organization = req.params.organizationName;

  try {
    const dailyCo2 = await SensorData.aggregate([
      { $match: { organizationName: organization } },
      {
        $project: {
          date: { $toDate: "$date" },
          co2: 1
        }
      },
      {
        $sort: { date: 1 }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" }},
          co2: { $last: "$co2" } // You could choose $avg, $max, etc., depending on your needs
        }
      },
      {
        $sort: { _id: 1 }
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          co2: 1
        }
      }
    ]);

    if (!dailyCo2 || dailyCo2.length === 0) {
      return res.status(404).json({ message: "No daily CO2 data found" });
    }
    res.json(dailyCo2);
  } catch (error) {
    console.error("Error retrieving daily CO2 data:", error);
    res.status(500).json({ message: "Error retrieving daily CO2 data" });
  }
});

// API to fetch weekly CO2 data for a specific organization
app.get('/api/co2s/week/:organizationName', async (req, res) => {
  const organization = req.params.organizationName;

  try {
    const weeklyCo2 = await SensorData.aggregate([
      { $match: { organizationName: organization } },
      {
        $addFields: {
          convertedDate: {
            $dateFromString: {
              dateString: "$date"
            }
          }
        }
      },
      {
        $project: {
          week: { $week: "$convertedDate" },
          year: { $year: "$convertedDate" },
          co2: 1
        }
      },
      {
        $group: {
          _id: { year: "$year", week: "$week" },
          co2: { $last: "$co2" },
          date: { $last: "$convertedDate" }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.week": 1 }
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          week: "$_id.week",
          co2: 1,
          date: 1
        }
      }
    ]);

    if (!weeklyCo2 || weeklyCo2.length === 0) {
      return res.status(404).json({ message: "No weekly CO2 data found" });
    }
    res.json(weeklyCo2);
  } catch (error) {
    console.error("Error retrieving weekly CO2 data:", error);
    res.status(500).json({ message: "Error retrieving weekly CO2 data" });
  }
});


app.get('/api/dustt/week/:organizationName', async (req, res) => {
  const organization = req.params.organizationName;

  try {
    const weeklyDustData = await SensorData.aggregate([
      { $match: { organizationName: organization } },
      {
        $addFields: {
          convertedDate: { $dateFromString: { dateString: "$date" } }
        }
      },
      {
        $project: {
          week: { $week: "$convertedDate" },
          year: { $year: "$convertedDate" },
          dust: 1
        }
      },
      {
        $group: {
          _id: { year: "$year", week: "$week" },
          dust: { $avg: "$dust" },
          date: { $last: "$convertedDate" }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.week": 1 }
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          week: "$_id.week",
          dust: 1,
          date: 1
        }
      }
    ]);

    if (!weeklyDustData.length) {
      return res.status(404).json({ message: "No weekly dust data found" });
    }

    res.json(weeklyDustData);
  } catch (error) {
    console.error("Error retrieving weekly dust data:", error);
    res.status(500).json({ message: "Error retrieving weekly dust data" });
  }
});


app.get('/api/dustt/5min/:organizationName', async (req, res) => {
  const organization = req.params.organizationName;

  try {
    // Assuming data is collected every 5 minutes and 12 entries are expected for the last hour
    const recentDustData = await SensorData.find({ organizationName: organization }, { dust: 1, date: 1 })
                                           .sort({ date: -1 })
                                           .limit(12);

    if (!recentDustData || recentDustData.length === 0) {
      return res.status(404).json({ message: "No recent dust data found" });
    }

    res.json(recentDustData.map(entry => ({ date: entry.date, dust: entry.dust })));
  } catch (error) {
    console.error("Error retrieving recent dust data:", error);
    res.status(500).json({ message: "Error retrieving recent dust data" });
  }
});


// API to fetch daily and weekly dust data, grouped by specific dates
app.get('/api/dustt/day/:organizationName', async (req, res) => {
  const organization = req.params.organizationName;

  try {
    const dailyDustData = await SensorData.aggregate([
      { $match: { organizationName: organization } },
      {
        $project: {
          date: { $toDate: "$date" },
          dust: 1
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            day: { $dayOfMonth: "$date" }
          },
          dust: { $avg: "$dust" },
          date: { $last: "$date" }
        }
      },
      {
        $sort: { "_id": 1 }
      },
      {
        $project: {
          _id: 0,
          date: 1,
          dust: 1
        }
      }
    ]);

    if (!dailyDustData.length) {
      return res.status(404).json({ message: "No daily dust data found" });
    }

    res.json(dailyDustData);
  } catch (error) {
    console.error("Error retrieving daily dust data:", error);
    res.status(500).json({ message: "Error retrieving daily dust data" });
  }
});


// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
