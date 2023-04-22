package config

import (
	log "github.com/sirupsen/logrus"

	"github.com/tkanos/gonfig"
)

// Defining Structure with port and DB URI as fields
type Configuration struct {
	Port      string
	DB_Uri    string
	DB_ss_Uri string
	DB_qa_Uri string
}

// Function to return the port and DB URI value from configuration file
func Config() (string, string, string, string) {

	//Declaring configuration variable of struct type
	configuration := Configuration{}

	//Reading Configuration file
	err := gonfig.GetConf("config.json", &configuration)
	if err != nil {
		log.Fatal(err)
	}

	return configuration.DB_Uri, configuration.DB_ss_Uri, configuration.DB_qa_Uri, configuration.Port

}
