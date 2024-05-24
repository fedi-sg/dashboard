#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <DHT.h>

// Remplacez par vos informations de réseau WiFi
const char* ssid = "Redmi 12";
const char* password = "12345678";

const int ledPin = 23;
const int measurePin = 34;
const int led_Pin = 21;
const int buzzer = 5;

#define DHTPIN 4
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

#define MQ135_PIN 35
#define MQ2_PIN 33
#define TRIG_PIN_WATER 19
#define ECHO_PIN_WATER 18
#define TRIG_PIN_FOURRAGE 2
#define ECHO_PIN_FOURRAGE 15
#define FAN_PIN 5
#define LUX_PIN 32


struct ControlStates {
    bool automatic;
    bool lampOn;
    bool heaterOn;
    bool fanOn;
    String startDateOfProduction;  // Assurez-vous que ce format de date est approprié pour votre usage
};
WiFiClient client;

void setup() {
  Serial.begin(9600);
  dht.begin();
  
  WiFi.begin(ssid, password);

  
  pinMode(FAN_PIN, OUTPUT);
  pinMode(TRIG_PIN_WATER, OUTPUT);
  pinMode(ECHO_PIN_WATER, INPUT);
  pinMode(TRIG_PIN_FOURRAGE, OUTPUT);
  pinMode(ECHO_PIN_FOURRAGE, INPUT);
  pinMode(ledPin, OUTPUT);
  pinMode(led_Pin, OUTPUT);

}


ControlStates getControlStates() {
    ControlStates states = {false, false, false, false, ""};  // Valeurs par défaut
    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("WiFi not connected!");
        return states;
    }
    HTTPClient http;
    http.begin(client, "http://192.168.48.165:3000/api/actions/ds");  // URL correcte
    int httpCode = http.GET();
    if (httpCode > 0) {
        String payload = http.getString();
        Serial.println("Received data: " + payload);
        StaticJsonDocument<300> doc;  // Augmentez la taille si nécessaire
        DeserializationError error = deserializeJson(doc, payload);
        if (error) {
            Serial.print(F("deserializeJson() failed: "));
            Serial.println(error.f_str());
            http.end();
            return states;
        }
        states.automatic = doc["automatic"] | false;  // Utilisation de l'opérateur 'or' pour les valeurs par défaut
        states.lampOn = doc["lampOn"] | false;
        states.heaterOn = doc["heaterOn"] | false;
        states.fanOn = doc["fanOn"] | false;
        states.startDateOfProduction = doc["startDateOfProduction"].as<String>();  // Assurez-vous que le format est correct
    } else {
        Serial.println("Failed to get response");
    }
    http.end();
    return states;
}



void loop() {

const char* s = "ds";
  int waterLevel = readUltrasonicLevel(TRIG_PIN_WATER, ECHO_PIN_WATER);
  int fourrageLevel = readUltrasonicLevel(TRIG_PIN_FOURRAGE, ECHO_PIN_FOURRAGE);
   ControlStates states = getControlStates();
    float humidity = dht.readHumidity();
    float temperature = dht.readTemperature();
    int mq2Value = analogRead(MQ2_PIN);
    int mq135_val = analogRead(MQ135_PIN);
    int dustDensity = readDustSensor();
    int luminosite = analogRead(LUX__PIN);

    if (states.automatic) {
        // Logique automatique
        if (temperature > 30 || humidity > 80 || mq135_val > 700) {
            digitalWrite(FAN_PIN, LOW);
            Serial.println("Ventilateur activé automatiquement");
        } else {
            digitalWrite(FAN_PIN, HIGH);
        }
        if (luminosite > 250) {  
            digitalWrite(led_Pin, HIGH);
        } else {
            digitalWrite(led_Pin, LOW);
        }
    } else {
        // Lecture et actions basées sur les états manuels de lamp et fan
        digitalWrite(FAN_PIN, states.fanOn ? LOW : HIGH);  // LOW pour activer, HIGH pour désactiver
        digitalWrite(led_Pin, states.lampOn ? HIGH : LOW);
        Serial.println("Contrôle manuel activé");
    }

 if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(client, "http://192.168.48.165:3000/sensor-data");
    http.addHeader("Content-Type", "application/json");

    StaticJsonDocument<300> doc;
    doc["organizationName"] = s;
    doc["temperature"] = temperature;
    doc["humidity"] = humidity;
    doc["co2"] = mq135_val;
    doc["nh3"] = mq2Value;
    doc["dust"] = dustDensity;
    doc["luminosity"] = luminosite;
    doc["fooder"] = 100-fourrageLevel;
    doc["water"] = 100-waterLevel;

    String requestBody;
    serializeJson(doc, requestBody);
    Serial.println(requestBody);

    int httpResponseCode = http.POST(requestBody);
    if (httpResponseCode > 0) {
      String response = http.getString();
    } else {
      Serial.print("Error on sending POST: ");
      Serial.println(httpResponseCode);
    }
    http.end();
} else {
    Serial.println("Error in WiFi connection");
}

  delay(3000); // Delay before the next measurement
}

float readUltrasonicLevel(int trigPin, int echoPin) {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  float duration = pulseIn(echoPin, HIGH);
  float distance = (duration * 0.0343) / 2;
  if (distance>200)distance=200;

  return distance/2;
}
int readDustSensor() {
  // Simulation de la lecture du capteur de poussière
  // Dans une application réelle, vous remplaceriez ce code par la lecture du capteur
  
  digitalWrite(ledPin, LOW); // Activer le LED du capteur
  delayMicroseconds(280); // Attendre 0.28ms
  int voMeasured = analogRead(measurePin); // Lire la valeur du capteur
  

  digitalWrite(ledPin, HIGH); // Désactiver le LED du capteur
  
  // Conversion de la valeur mesurée en densité de poussière (µg/m3)
  // Ces calculs sont basés sur la documentation du capteur GP2Y1010AU0F
  float calcVoltage = voMeasured * (5.0 / 1024.0);
  int dustDensity = (int)((0.17 * calcVoltage - 0.1) * 1000);
  
  return dustDensity;
}
