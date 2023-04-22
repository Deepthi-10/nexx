FROM golang:latest

ENV https_proxy=http://web-proxy.sgp.hpecorp.net:8080

ENV http_proxy=http://web-proxy.sgp.hpecorp.net:8080

WORKDIR /app

COPY go.mod .

COPY go.sum .

RUN go mod download

COPY . .

EXPOSE 8080

RUN go mod tidy

RUN go build

ENTRYPOINT [ "./Backend" ]