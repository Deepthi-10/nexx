package internal

import (
	"net/http"

	log "github.com/sirupsen/logrus"
)

func Logging(r *http.Request) {
	//Setting Fields of request which are needed to be logged
	log.WithFields(
		log.Fields{
			"URL":       r.URL.String(),
			"Method":    r.Method,
			"Header":    r.Header,
			"client ip": r.RemoteAddr,
		},
	).Info("Information about request")

}
