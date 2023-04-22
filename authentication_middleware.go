package handlers

import (
	"fmt"
	"net/http"
	"strings"

	log "github.com/sirupsen/logrus"
)

// A middleware function to check whether requests are authorized by checking the access token sent in the header.
func middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		arr := [2]string{"/products", "/release"}
		log.Info("********", r.Method, "***********")
		//The get routes of /release and /products are not authorized
		for i := 0; i < 2; i++ {
			if r.RequestURI == arr[i] && r.Method == "GET" {
				next.ServeHTTP(w, r)
				return
			}
		}

		// Get the bearer token from request
		reqToken := r.Header.Get("Authorization")

		splitToken := strings.Split(reqToken, "Bearer")
		if len(splitToken) != 2 {
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte("Unauthorized"))
		} else {
			reqToken = strings.TrimSpace(splitToken[1])

			client := &http.Client{}
			var url = "https://github.hpe.com/api/v3/user"
			req, err := http.NewRequest("GET", url, nil)
			if err != nil {
				log.Fatal(err)
			}

			var bearer = "Bearer " + reqToken

			req.Header.Set("Authorization", bearer)

			// If the response is not 200 then show it is  unauthorized
			resp, err := client.Do(req)

			log.Info("#######", resp.StatusCode, "########")

			if resp.StatusCode != 200 {
				fmt.Println(err)
				w.WriteHeader(http.StatusUnauthorized)
				w.Write([]byte("Unauthorized"))
				resp.Body.Close()
			} else {
				next.ServeHTTP(w, r)
			}
		}
	})
}

/*package handlers

import (
	"fmt"
	"net/http"
	"strings"

	log "github.com/sirupsen/logrus"
)

// A middleware function to check whether requests are authorized by checking the access token sent in the header.
func middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		    arr := [2]string{"/products","/release"}
			log.Info("********",r.Method,"***********");
//The get routes of /release and /products are not authorized
			for i:= 0; i < 2; i++{
				if r.RequestURI == arr[i] && r.Method == "GET"{
					next.ServeHTTP(w,r)
					return;
				}
			}

			// Get the bearer token from request
			reqToken := r.Header.Get("Authorization")

			splitToken := strings.Split(reqToken, "Bearer")
			if len(splitToken) != 2 {
				w.WriteHeader(http.StatusUnauthorized)
				w.Write([]byte("Unauthorized"))
			}else{
			reqToken = strings.TrimSpace(splitToken[1])


			client := &http.Client{}
			var url = "https://github.hpe.com/api/v3/user"
			req, err := http.NewRequest("GET",url, nil)

			var bearer = "Bearer " + reqToken

			req.Header.Set("Authorization", bearer)


// If the response is not 200 then show it is  unauthorized
			resp, err := client.Do(req)

			log.Info("#######",resp.StatusCode,"########")

			if resp.StatusCode != 200 {
				fmt.Println(err)
				w.WriteHeader(http.StatusUnauthorized)
				w.Write([]byte("Unauthorized"))
				resp.Body.Close()
			} else {
				next.ServeHTTP(w,r)
			}
		}
	})
}*/
