package handlers

import (
	"net/http"

	"github.com/gorilla/mux"
	log "github.com/sirupsen/logrus"
)

func InitializeRouter(port string) {

	portvalue := ":" + port
	r := mux.NewRouter()

	r.Use(middleware)
	//The below routes are used for Artifacts release
	r.HandleFunc("/release", GetAllArificats).Methods("GET")
	r.HandleFunc("/release", CreateRealease).Methods("POST")
	r.HandleFunc("/release/{id}", UpdateRealease).Methods("PUT")
	r.HandleFunc("/release/{id}", DeleteRealease).Methods("DELETE")
	r.HandleFunc("/release/{product_name}", GetMajorRelease).Methods("GET")
	r.HandleFunc("/release/{product_name}/{major_release_version}", GetMinorRelease).Methods("GET")
	r.HandleFunc("/artifacts/major/{product_name}/{major_release_version}", GetArtifactsMajorRelease).Methods("GET")
	r.HandleFunc("/artifacts/minor/{product_name}/{major_release_version}/{minor_release_version}", GetArtifactsMinorRelease).Methods("GET")
	// The below routes are used for Patch Artifacts release
	r.HandleFunc("/patchartifacts", GetAllPatchArificats).Methods("GET")
	r.HandleFunc("/patchartifacts", CreatePatchArtifacts).Methods("POST")
	r.HandleFunc("/patchartifacts/{id}", UpdatePatchArtifacts).Methods("PUT")
	r.HandleFunc("/patchartifacts/{id}", DeletePatchArtifacts).Methods("DELETE")
	r.HandleFunc("/patchartifacts/{patch_name}", GetPatchArtifacts).Methods("GET")

	//The below routes are used for Product release
	r.HandleFunc("/products", GetProducts).Methods("GET")
	r.HandleFunc("/products", CreateProducts).Methods("POST")
	r.HandleFunc("/products/{id}", UpdateProducts).Methods("PUT")
	r.HandleFunc("/products/{id}", DeleteProducts).Methods("DELETE")

	//The below route is used as proxy server which helps in getting the data from the nexus server
	r.HandleFunc("/proxy", Proxy).Methods("POST")

	log.Info("Starting server at port: ", portvalue)
	log.Fatal(http.ListenAndServe(portvalue,
		&CORSRouterDecorator{r}))

}

type CORSRouterDecorator struct {
	R *mux.Router
}

// To avoid the CORS error
func (c *CORSRouterDecorator) ServeHTTP(rw http.ResponseWriter,
	req *http.Request) {
	if origin := req.Header.Get("Origin"); origin != "" {
		rw.Header().Set("Access-Control-Allow-Origin", origin)
		rw.Header().Set("Access-Control-Allow-Methods",
			"POST, GET, OPTIONS, PUT, DELETE")
		rw.Header().Set("Access-Control-Allow-Headers",
			"Accept, Accept-Language,"+
				" Content-Type, YourOwnHeader,Authorization")
	}
	// Stop here if its Preflighted OPTIONS request
	if req.Method == "OPTIONS" {
		return
	}

	c.R.ServeHTTP(rw, req)
}
