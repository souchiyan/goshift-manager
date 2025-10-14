FROM golang:1.25
WORKDIR /go/src

COPY go* ./
RUN go mod download 

COPY . .