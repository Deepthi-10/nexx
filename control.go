package handlers

import (
	db "Backend/database"
	dbqa "Backend/database"
	dbss "Backend/database"
	structure "Backend/entities"
	logg "Backend/internal"
	"crypto/tls"
	"encoding/json"
	"io"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	log "github.com/sirupsen/logrus"

	_ "github.com/go-sql-driver/mysql"
)

// Create Artifacts
func CreateRealease(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	logg.Logging(r)
	var test structure.Artifacts
	json.NewDecoder(r.Body).Decode(&test)
	var server = r.URL.Query().Get("server") //checking string if ss/qa/release to create 3 different schema based on if condition
	if server == "ss" {
		dbss.DBSS.Create(&test) // code to be executed if condition-1 is true
	} else if server == "qa" {
		dbqa.DBQA.Create(&test) // code to be executed if condition-2 is true
	} else {
		db.DB.Create(&test) // code to be executed if both condition1 and condition2 are false
	}
	json.NewEncoder(w).Encode(test)

}

// Get all artifacts
func GetAllArificats(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	logg.Logging(r)
	var test []structure.Artifacts
	var server = r.URL.Query().Get("server")
	if server == "ss" {
		dbss.DBSS.Find(&test) // code to be executed if condition-1 is true
	} else if server == "qa" {
		dbqa.DBQA.Find(&test) // code to be executed if condition-2 is true
	} else {
		db.DB.Find(&test) // code to be executed if both condition1 and condition2 are false
	}
	json.NewEncoder(w).Encode(test)
}

// Get Major release
func GetMajorRelease(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	logg.Logging(r)
	params := mux.Vars(r)
	value := params["product_name"]
	var test []structure.Artifacts
	var server = r.URL.Query().Get("server")
	if server == "ss" {
		//dbss.DBSS.Find(&test) // code to be executed if condition-1 is true
		dbss.DBSS.Raw("select distinct major_release_version from artifacts where product_name =  ?  ", value).Scan(&test) //log.Info("#######", test, "########")
	} else if server == "qa" {
		//dbqa.DBQA.Find(&test)
		dbqa.DBQA.Raw("select distinct major_release_version from artifacts where product_name =  ?  ", value).Scan(&test) // code to be executed if condition-2 is true
		//log.Info("#######", test, "########")
	} else {
		//db.DB.Find(&test) // code to be executed if both condition1 and condition2 are false
		db.DB.Raw("select distinct major_release_version from artifacts where product_name =  ?  ", value).Scan(&test) //log.Info("#######", test, "########")
	}

	json.NewEncoder(w).Encode(test)

}

// Get Minor release
func GetMinorRelease(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	logg.Logging(r)
	params := mux.Vars(r)
	value := params["product_name"]
	value1 := params["major_release_version"]
	var test []structure.Artifacts
	var server = r.URL.Query().Get("server")
	if server == "ss" {
		dbss.DBSS.Raw("select distinct minor_release_version, major_release_version  from artifacts where product_name = ? and major_release_version =  ?", value, value1).Scan(&test) // code to be executed if condition-1 is true
	} else if server == "qa" {
		dbqa.DBQA.Raw("select distinct minor_release_version, major_release_version  from artifacts where product_name = ? and major_release_version =  ?", value, value1).Scan(&test) // code to be executed if condition-2 is true
	} else {
		db.DB.Raw("select distinct minor_release_version, major_release_version  from artifacts where product_name = ? and major_release_version =  ?", value, value1).Scan(&test) // code to be executed if both condition1 and condition2 are false
	}

	json.NewEncoder(w).Encode(test)

}

// Get artifacts of major Release
func GetArtifactsMajorRelease(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	logg.Logging(r)
	params := mux.Vars(r)
	value := params["product_name"]
	value1 := params["major_release_version"]
	var test []structure.Artifacts
	var server = r.URL.Query().Get("server")
	if server == "ss" {
		dbss.DBSS.Raw("select * from artifacts where product_name = ? and major_release_version = ? and minor_release_version is null", value, value1).Scan(&test) // code to be executed if condition-1 is true
	} else if server == "qa" {
		dbqa.DBQA.Raw("select * from artifacts where product_name = ? and major_release_version = ? and minor_release_version is null", value, value1).Scan(&test) // code to be executed if condition-2 is true
	} else {
		db.DB.Raw("select * from artifacts where product_name = ? and major_release_version = ? and minor_release_version is null", value, value1).Scan(&test) // code to be executed if both condition1 and condition2 are false
	}

	json.NewEncoder(w).Encode(test)

}

// Get artifacts of minor Release
func GetArtifactsMinorRelease(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	logg.Logging(r)
	params := mux.Vars(r)
	value := params["product_name"]
	value1 := params["major_release_version"]
	value2 := params["minor_release_version"]
	var test []structure.Artifacts
	var server = r.URL.Query().Get("server")
	if server == "ss" {
		dbss.DBSS.Raw("select * from artifacts where product_name = ? and major_release_version = ? and minor_release_version = ?", value, value1, value2).Scan(&test) // code to be executed if condition-1 is true
	} else if server == "qa" {
		dbqa.DBQA.Raw("select * from artifacts where product_name = ? and major_release_version = ? and minor_release_version = ?", value, value1, value2).Scan(&test) // code to be executed if condition-2 is true
	} else {
		db.DB.Raw("select * from artifacts where product_name = ? and major_release_version = ? and minor_release_version = ?", value, value1, value2).Scan(&test) // code to be executed if both condition1 and condition2 are false
	}
	json.NewEncoder(w).Encode(test)

}

// Get all Patches artifacts
func GetAllPatchArificats(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	logg.Logging(r)
	var test []structure.Patches_Artifacts
	var server = r.URL.Query().Get("server")
	if server == "ss" {
		dbss.DBSS.Find(&test) // code to be executed if condition-1 is true
	} else if server == "qa" {
		dbqa.DBQA.Find(&test) // code to be executed if condition-2 is true
	} else {
		db.DB.Find(&test) // code to be executed if both condition1 and condition2 are false
	}
	json.NewEncoder(w).Encode(test)
}

// Get Patch Artifacts
func GetPatchArtifacts(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	logg.Logging(r)
	params := mux.Vars(r)
	value1 := params["patch_name"]
	var test []structure.Patches_Artifacts
	var server = r.URL.Query().Get("server")
	if server == "ss" {
		dbss.DBSS.Raw("select * from patches_artifacts where patches_name = ? ", value1).Scan(&test) // code to be executed if condition-1 is true
	} else if server == "qa" {
		dbqa.DBQA.Raw("select * from patches_artifacts where patches_name = ? ", value1).Scan(&test) // code to be executed if condition-2 is true
	} else {
		db.DB.Raw("select * from patches_artifacts where patches_name = ? ", value1).Scan(&test) // code to be executed if both condition1 and condition2 are false
	}
	json.NewEncoder(w).Encode(test)
}

// Create Patch Artifacts
func CreatePatchArtifacts(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	logg.Logging(r)
	var test structure.Patches_Artifacts
	json.NewDecoder(r.Body).Decode(&test)
	var server = r.URL.Query().Get("server")
	if server == "ss" {
		dbss.DBSS.Create(&test) // code to be executed if condition-1 is true
	} else if server == "qa" {
		dbqa.DBQA.Create(&test) // code to be executed if condition-2 is true
	} else {
		db.DB.Create(&test) // code to be executed if both condition1 and condition2 are false
	}
	json.NewEncoder(w).Encode(test)

}

// Create new products
func CreateProducts(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	logg.Logging(r)
	var test structure.Products
	json.NewDecoder(r.Body).Decode(&test)
	var server = r.URL.Query().Get("server")
	if server == "ss" { ///products?server=ss
		dbss.DBSS.Create(&test) // code to be executed if condition-1 is true
	} else if server == "qa" {
		dbqa.DBQA.Create(&test) // code to be executed if condition-2 is true
	} else {
		db.DB.Create(&test) // code to be executed if both condition1 and condition2 are false
	}
	json.NewEncoder(w).Encode(test)

}

// Get all products
func GetProducts(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	logg.Logging(r)
	var test []structure.Products
	var server = r.URL.Query().Get("server")
	if server == "ss" {
		dbss.DBSS.Find(&test) // code to be executed if condition-1 is true
		//log.Info("#######", test, "########")
	} else if server == "qa" {
		dbqa.DBQA.Find(&test) // code to be executed if condition-2 is true
		//log.Info("#######", test, "########")
	} else {
		db.DB.Find(&test) // code to be executed if both condition1 and condition2 are false
		//log.Info("#######", test, "########")
	}

	json.NewEncoder(w).Encode(test)
}

// udpate products
func UpdateProducts(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	logg.Logging(r)
	params := mux.Vars(r)
	var test structure.Products
	var server = r.URL.Query().Get("server")
	if server == "ss" {
		dbss.DBSS.First(&test, params["id"])
		json.NewDecoder(r.Body).Decode(&test)
		dbss.DBSS.Save(&test) // code to be executed if condition-1 is true
		//log.Info("#######", test, "########")
	} else if server == "qa" {
		dbqa.DBQA.First(&test, params["id"])
		json.NewDecoder(r.Body).Decode(&test)
		dbqa.DBQA.Save(&test) // code to be executed if condition-2 is true
		//log.Info("#######", test, "########")
	} else {
		db.DB.First(&test, params["id"])
		json.NewDecoder(r.Body).Decode(&test)
		db.DB.Save(&test) // code to be executed if both condition1 and condition2 are false
		//log.Info("#######", test, "########")
	}

	json.NewEncoder(w).Encode(test)

}

// udpate  artifacts
func UpdateRealease(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	logg.Logging(r)
	params := mux.Vars(r)
	var test structure.Artifacts
	var server = r.URL.Query().Get("server")
	if server == "ss" {
		dbss.DBSS.First(&test, params["id"])
		json.NewDecoder(r.Body).Decode(&test)
		dbss.DBSS.Save(&test) // code to be executed if condition-1 is true
		//log.Info("#######", test, "########")
	} else if server == "qa" {
		dbqa.DBQA.First(&test, params["id"])
		json.NewDecoder(r.Body).Decode(&test)
		dbqa.DBQA.Save(&test) // code to be executed if condition-2 is true
		//log.Info("#######", test, "########")
	} else {
		db.DB.First(&test, params["id"])
		json.NewDecoder(r.Body).Decode(&test)
		db.DB.Save(&test) // code to be executed if both condition1 and condition2 are false
		//log.Info("#######", test, "########")
	}

	json.NewEncoder(w).Encode(test)

}

// update patch artifacts
func UpdatePatchArtifacts(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	logg.Logging(r)
	params := mux.Vars(r)
	var test structure.Patches_Artifacts
	var server = r.URL.Query().Get("server")
	if server == "ss" {
		dbss.DBSS.First(&test, params["id"])
		json.NewDecoder(r.Body).Decode(&test)
		dbss.DBSS.Save(&test) // code to be executed if condition-1 is true
		//log.Info("#######", test, "########")
	} else if server == "qa" {
		dbqa.DBQA.First(&test, params["id"])
		json.NewDecoder(r.Body).Decode(&test)
		dbqa.DBQA.Save(&test) // code to be executed if condition-2 is true
		//log.Info("#######", test, "########")
	} else {
		db.DB.First(&test, params["id"])
		json.NewDecoder(r.Body).Decode(&test)
		db.DB.Save(&test) // code to be executed if both condition1 and condition2 are false
		//log.Info("#######", test, "########")
	}

	json.NewEncoder(w).Encode(test)

}

// Delete Products
func DeleteProducts(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	logg.Logging(r)
	params := mux.Vars(r)
	var test structure.Products
	var server = r.URL.Query().Get("server")
	if server == "ss" {
		dbss.DBSS.Delete(&test, params["id"]) // code to be executed if condition-1 is true
		//log.Info("#######", test, "########")
	} else if server == "qa" {
		dbqa.DBQA.Delete(&test, params["id"]) // code to be executed if condition-2 is true
		//log.Info("#######", test, "########")
	} else {
		db.DB.Delete(&test, params["id"]) // code to be executed if both condition1 and condition2 are false
		//log.Info("#######", test, "########")
	}

	json.NewEncoder(w).Encode("The Record is Deleted Successfully!")

}

// Delete Artifacts
func DeleteRealease(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	logg.Logging(r)
	params := mux.Vars(r)
	var test structure.Artifacts
	var server = r.URL.Query().Get("server")
	if server == "ss" {
		dbss.DBSS.Delete(&test, params["id"]) // code to be executed if condition-1 is true
		//log.Info("#######", test, "########")
	} else if server == "qa" {
		dbqa.DBQA.Delete(&test, params["id"]) // code to be executed if condition-2 is true
		//log.Info("#######", test, "########")
	} else {
		db.DB.Delete(&test, params["id"]) // code to be executed if both condition1 and condition2 are false
		//log.Info("#######", test, "########")
	}

	json.NewEncoder(w).Encode("The Record is Deleted Successfully!")

}

// Delete Patch Artifacts
func DeletePatchArtifacts(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	logg.Logging(r)
	params := mux.Vars(r)
	var test structure.Patches_Artifacts
	var server = r.URL.Query().Get("server")
	if server == "ss" {
		dbss.DBSS.Delete(&test, params["id"]) // code to be executed if condition-1 is true
		//log.Info("#######", test, "########")
	} else if server == "qa" {
		dbqa.DBQA.Delete(&test, params["id"]) // code to be executed if condition-2 is true
		//log.Info("#######", test, "########")
	} else {
		db.DB.Delete(&test, params["id"]) // code to be executed if both condition1 and condition2 are false
		//log.Info("#######", test, "########")
	}

	json.NewEncoder(w).Encode("The Record is Deleted Successfully!")

}

// Proxy to download files from nexus
func Proxy(w http.ResponseWriter, r *http.Request) {
	var proxy structure.Proxy
	json.NewDecoder(r.Body).Decode(&proxy)
	var username string = "admin"
	var passwd string = "dinexus"
	tr := &http.Transport{
		TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
	}
	client := &http.Client{Transport: tr}
	req, err := http.NewRequest("GET", proxy.URL, nil)
	if err != nil {
		log.Fatal(err)
	}
	req.SetBasicAuth(username, passwd)
	req.Header.Add("content-length", "application/zip")
	resp, err := client.Do(req)
	if err != nil {
		log.Fatal(err)
	}
	w.Header().Add("Content-length", strconv.Itoa(int(resp.ContentLength)))
	io.Copy(w, resp.Body)
	resp.Body.Close()

}
