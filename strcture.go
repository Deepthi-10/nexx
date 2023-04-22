// Defining Structure with required  parameters
// Defining Structure with required  parameters
package entities

import (
	dt "gorm.io/datatypes"
	"gorm.io/gorm"
)

type Products struct {
	gorm.Model
	Product_Name string `json:"product_name" gorm:"default:null"`
	Description  string `json:"product_description" gorm:"default:null"`
}

type Artifacts struct {
	gorm.Model
	Product_Name          string  `json:"product_name" gorm:"default:null"`
	Major_Release_Version string  `json:"major_release_version" gorm:"default:null"`
	Minor_Release_Version string  `json:"minor_release_version" gorm:"default:null"`
	Zip_File              dt.JSON `json:"zip_file" gorm:"default:null;type:json"`
	Documentation         dt.JSON `json:"documentation" gorm:"default:null;type:json"`
	Release_Notes         dt.JSON `json:"Release_Notes" gorm:"default:null;type:json"`
	Binary_Installers     dt.JSON `json:"binary_installers" gorm:"default:null;type:json"`
	EIUM_Option_Bundle    dt.JSON `json:"eium_option_bundle" gorm:"default:null;type:json"`
	EULA                  dt.JSON `json:"eula" gorm:"default:null;type:json"`
	Patches               dt.JSON `json:"patches" gorm:"default:null;type:json" `
	Scan_Reports          dt.JSON `json:"scan_reports" gorm:"default:null;type:json"`
	Images                dt.JSON `json:"images" gorm:"default:null;type:json" `
}

type Patches_Artifacts struct {
	gorm.Model
	Major_Release_Version string  `json:"major_release_version" gorm:"default:null"`
	Minor_Release_Version string  `json:"minor_release_version" gorm:"default:null"`
	Patches_Name          string  `json:"patches_name" gorm:"default:null"`
	Release_Notes         dt.JSON `json:"release_notes" gorm:"default:null;type:json"`
	Patches               dt.JSON `json:"patches" gorm:"default:null;type:json"`
	Images                dt.JSON `json:"images" gorm:"default:null;type:json" `
}

type Proxy struct {
	URL string `json:"URL"`
}

type DailyBuilds struct {
	gorm.Model
	Major_Release_Version string `json:"major_release_version" gorm:"default:null"`
	Minor_Release_Version string `json:"minor_release_version" gorm:"default:null"`
	Serial_no             string `json:"serial_no" gorm:"default:null"`
	Created_date          string `json:"created_date" gorm:"default:null"`
	Completed_date        string `json:"completed_date" gorm:"default:null"`
	Products              string `json:"product_name" gorm:"default:null"`
}

type QA struct {
	gorm.Model
	Major_Release_Version string `json:"major_release_version" gorm:"default:null"`
	Minor_Release_Version string `json:"minor_release_version" gorm:"default:null"`
	Serial_no             string `json:"serial_no" gorm:"default:null"`
	Created_date          string `json:"created_date" gorm:"default:null"`
	Completed_date        string `json:"completed_date" gorm:"default:null"`
	Products              string `json:"product_name" gorm:"default:null"`
	Approved              string `json:"approved_status" gorm:"default:null"`
}
