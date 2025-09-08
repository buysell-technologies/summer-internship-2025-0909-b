FROM golang:1.24-alpine3.22

ENV CGO_ENABLED=1

RUN apk update
RUN apk upgrade
RUN apk add --update figlet
RUN apk add build-base tzdata && \
    cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime && \
    echo "Asia/Tokyo" > /etc/timezone

# Go install Pack
RUN go install github.com/cespare/reflex@latest
RUN go install github.com/swaggo/swag/cmd/swag@v1.16.3

WORKDIR /go/src/server
