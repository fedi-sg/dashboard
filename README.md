Here is the revised `README.md` with the demo and hardware/software requirements sections moved to the top:

```markdown
# DashPoultry: Comprehensive Poultry Farm Management Dashboard

## Demo


   ```

https://github.com/fedi-sg/dashboard/assets/170746218/b8979f30-4fe4-4c5d-90dc-0cf68ba955d8

   ```

To run the demo locally, follow these steps:

1. **Clone the repository:**
   ```sh
   git clone https://github.com/fedi-sg/dashboard.git
   cd dashboard

   ```


2. **Install the required dependencies:**
   Make sure you have [Node.js](https://nodejs.org/) and npm installed.
   ```sh
   npm install
   ```

3. **Run the server:**
   ```sh
   npm start
   ```

4. **Open your browser and navigate to:**
   ```
   http://localhost:3000
   ```

## Hardware and Software Requirements

### Hardware Requirements
- **Computer/Server**: A machine capable of running a Node.js server.
  - **Processor**: Minimum 2 GHz dual-core CPU.
  - **RAM**: Minimum 4 GB of RAM (8 GB recommended for better performance).
  - **Storage**: Minimum 20 GB of free disk space.
- **ESP32 Microcontroller**: For connecting and managing the sensors.
  - **ESP32 Development Board**: Such as the ESP32-WROOM-32.
- **Sensors**:
  - **Temperature Sensor**: DHT11, DHT22, or DS18B20.
  - **Humidity Sensor**: Often combined with temperature sensors like DHT11 or DHT22.
  - **Air Quality Sensors**: MQ-135 for CO2 and NH3 measurements.
  - **Dust Sensor**: GP2Y1010AU0F or DSM501A.
  - **Luminosity Sensor**: BH1750 or TSL2561.
- **Breadboard and Jumper Wires**: For connecting the sensors to the ESP32.
- **Power Supply**: USB power supply for the ESP32.
- **Internet Connection**: Required for the ESP32 to send data to the server and for accessing the dashboard remotely.

### Software Requirements
- **Operating System**:
  - **Windows 10/11**
  - **macOS**
  - **Linux (Ubuntu recommended)**
- **Node.js**: JavaScript runtime environment.
  - Version: 12.x or later
  - Installation:
    - **Windows/macOS**: Download the installer from [Node.js official website](https://nodejs.org/) and follow the installation instructions.
    - **Linux (Ubuntu)**:
      ```sh
      sudo apt update
      sudo apt install nodejs npm
      ```
- **npm (Node Package Manager)**: Comes with Node.js. Used for managing project dependencies.
  - Version: 6.x or later
- **Git**: Version control system to manage the project code.
  - Version: 2.x or later
  - Installation:
    - **Windows/macOS**: Download the installer from [Git official website](https://git-scm.com/) and follow the installation instructions.
    - **Linux (Ubuntu)**:
      ```sh
      sudo apt update
      sudo apt install git
      ```
- **Arduino IDE**: For programming the ESP32.
  - Version: 1.8.x or later
  - Installation: Download from [Arduino official website](https://www.arduino.cc/en/software).
- **Text Editor/IDE**: For writing and editing code.
  - **Visual Studio Code**: Recommended for its rich feature set and extensions.
  - **Sublime Text**
  - **Atom**
- **Web Browser**: For accessing the dashboard.
  - **Google Chrome** (recommended)
  - **Mozilla Firefox**
  - **Microsoft Edge**

### Libraries and Frameworks
- **Express.js**: For building the backend server.
- **Chart.js**: For creating interactive charts.
- **JustGage**: For displaying gauge indicators.
- **Bootstrap**: For responsive design.
- **jQuery**: For DOM manipulation and AJAX requests.

## Problem Statement
Poultry farming involves managing numerous critical parameters to ensure the health and productivity of the flock. Farmers often face challenges in monitoring environmental conditions such as temperature, humidity, air quality, and feed levels, which can directly impact poultry health and farm efficiency. The lack of real-time data and integrated management tools can lead to suboptimal conditions, resulting in poor growth, higher mortality rates, and reduced egg production.

## Solution
DashPoultry is an all-in-one solution designed to address these challenges by providing an intuitive and visually appealing dashboard that consolidates all essential farm management data. By leveraging modern web technologies, DashPoultry enables farmers to monitor, analyze, and control various environmental parameters in real-time, enhancing decision-making and improving overall farm performance.

## Dashboard Features
### Temperature Monitoring
- **Graphical Display**: Real-time temperature data is displayed through dynamic line charts, allowing farmers to track changes and identify trends.
- **Temperature Gauges**: Visual gauges provide an immediate overview of current temperature levels.
- **Historical Data**: Temperature history table lists recent temperature readings, ensuring comprehensive monitoring.

### Humidity Control
- **Humidity Charts**: Line charts show humidity trends over time.
- **Humidity Gauges**: Real-time humidity levels are displayed using easy-to-read gauges.
- **History Table**: Keeps a record of historical humidity data for analysis.

### Air Quality Management
- **CO2 and NH3 Monitoring**: Separate gauges and charts for CO2 and ammonia levels, ensuring air quality is within safe limits.
- **Dust Levels**: Tracks dust particles to maintain a healthy environment for the flock.

### Feed and Water Management
- **Feed Level Gauges**: Real-time monitoring of feed levels to prevent shortages.
- **Water Level Gauges**: Ensures adequate water supply by displaying real-time water levels.
- **History Tables**: Detailed records of feed and water levels over time.

### User Profile Management
- **Account Details**: Allows users to update personal and organizational details.
- **Customizable Settings**: Users can tailor the dashboard to fit specific farm requirements.

### Notifications and Alerts
- **Real-time Alerts**: Notification system alerts farmers to critical conditions such as high temperatures or low feed levels.
- **Notification Management**: Users can view, manage, and dismiss notifications through an intuitive interface.

### Control and Automation
- **Environmental Controls**: Interface for toggling automatic controls for fans, lamps, and heaters.
- **Production Start Date**: Allows farmers to set and update the start date of production, which adjusts ideal condition parameters.

### Special Features
- **Dark and Light Modes**: Customizable display settings to reduce eye strain and adapt to different lighting conditions.
- **Extensive Documentation**: Comprehensive guides and support documentation to help users maximize the dashboard's capabilities.

## Implementation Details
DashPoultry is built using modern web technologies like Bootstrap 4, Chart.js for dynamic charts, and JustGage for real-time gauges. The backend integrates with APIs to fetch real-time data and provide seamless user interactions.

## File Structure
Within the download you'll find the following directories and files:

```
DashPoultry/
├── .github/
│   └── workflows/
│       └── main.yml
├── assets/
│   ├── css/
│   │   ├── black-dashboard.css
│   │   ├── demo.css
│   │   └── nucleo-icons.css
│   ├── img/
│   │   ├── apple-icon.png
│   │   ├── favicon.png
│   │   └── ... (other images)
│   └── js/
│       ├── core/
│       │   ├── jquery.min.js
│       │   ├── popper.min.js
│       │   └── bootstrap.min.js
│       ├── plugins/
│       │   ├── bootstrap-notify.js
│       │   ├── chartjs.min.js
│       │   └── perfect-scrollbar.jquery.min.js
│       ├── black-dashboard.min.js
│       └── demo.js
├── examples/
│   └── ... (example files)
├── images/
│   ├── logo.png
│   └── screenshot.png
├── src/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── air.js
│   │   ├── gaz.js
│   │   ├── hum.js
│   │   ├── initial.js
│   │   ├── lux.js
│   │   ├── temp.js
│   │   └── ... (other scripts)
├── examples
│   ├── dashboard.html
│   └── index.html
├── .gitignore
├── README.md
├── package.json
├── server.js
└── ... (other root-level files)
```

## Setting Up the ESP32 with Sensors

### Install ESP32 Board in Arduino IDE
1. Open Arduino IDE.
2. Go to `File` -> `Preferences`.
3. In the "Additional Board Manager URLs" field,

 add: `https://dl.espressif.com/dl/package_esp32_index.json`.
4. Go to `Tools` -> `Board` -> `Boards Manager`, search for `esp32` and install the package.

### Connect Sensors to ESP32
- Connect the sensors to the ESP32 following the appropriate wiring diagrams. Use the ESP32's GPIO pins to interface with the sensors.

### Install Required Libraries in Arduino IDE
- Install necessary libraries for the sensors:
  ```sh
  # For DHT sensors
  Install "DHT sensor library" by Adafruit
  Install "Adafruit Unified Sensor" by Adafruit

  # For BH1750 sensor
  Install "BH1750" by Christopher Laws

  # For Wi-Fi connectivity
  Install "WiFi" library (comes pre-installed with ESP32 package)
  ```

### Execute Code to Read Sensor Data and Send to Server
- Upload the code to the ESP32 using Arduino IDE.

### Run the Server
```sh
npm start
```

### Access the Dashboard
- Open a web browser and go to `http://localhost:3000`.

```
