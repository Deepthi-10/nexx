package database

import (
	structure "Backend/entities"
	"log"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB
var DBSS *gorm.DB
var DBQA *gorm.DB
var err error

// function to connect to Database
func Connect(connectionString string) {
	DB, err = gorm.Open(mysql.Open(connectionString), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
		panic("Cannot connect to DB")
	}
	log.Println("Connected to Database...")
}
func Connectss(connectionString string) {
	DBSS, err = gorm.Open(mysql.Open(connectionString), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
		panic("Cannot connect to DB")
	}
	log.Println("Connected to Database...")
}
func Connectqa(connectionString string) {
	DBQA, err = gorm.Open(mysql.Open(connectionString), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
		panic("Cannot connect to DB")
	}
	log.Println("Connected to Database...")
}

// function to automigrate Database
func Migrate() {
	DB.AutoMigrate(&structure.Artifacts{}, &structure.Patches_Artifacts{}, &structure.Products{}, &structure.DailyBuilds{}, &structure.QA{})
	DBSS.AutoMigrate(&structure.Artifacts{}, &structure.Patches_Artifacts{}, &structure.Products{}, &structure.DailyBuilds{}, &structure.QA{})
	DBQA.AutoMigrate(&structure.Artifacts{}, &structure.Patches_Artifacts{}, &structure.Products{}, &structure.DailyBuilds{}, &structure.QA{})
	log.Println("Database Migration Completed...")
}
