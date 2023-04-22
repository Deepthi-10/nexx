package main

import (
	config "Backend/config"
	db "Backend/database"
	dbqa "Backend/database"
	dbss "Backend/database"
	handler "Backend/handlers"
	"io"
	"os"

	log "github.com/sirupsen/logrus"
)

func init() {
	//Open file for log entry
	file, err := os.OpenFile("Log_File.txt", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0666)
	if err != nil {
		log.Fatal(err)
	}
	//writing logs both on console as well as file opened
	MultiWriter := io.MultiWriter(os.Stdout, file)
	log.SetOutput(MultiWriter)

	// to add the calling method as a field in logs
	log.SetReportCaller(true)
}

func main() {

	//Function call for getting DB_Uri and Port from configuration file
	DB_Uri, DB_ss_Uri, DB_qa_Uri, Port := config.Config()

	//Function call for Initalizing DB(migration) and handlerFunction(Router)
	db.Connect(DB_Uri)
	dbss.Connectss(DB_ss_Uri)
	dbqa.Connectqa(DB_qa_Uri)
	db.Migrate()
	dbss.Migrate()
	dbqa.Migrate()
	handler.InitializeRouter(Port)

}
