package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"shift-manager/internal/database"
	"shift-manager/internal/model"
)

func main() {
	database.InitDatabase() //データベース初期化
	http.HandleFunc("/todos", corsMiddleware(postTodoHandler))
	log.Fatal(http.ListenAndServe(":8080", nil))
	fmt.Println("localhost:8080で起動中")

}

func postTodoHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodPost {
		http.Error(w, "このメソッドは許可されていません", http.StatusInternalServerError)
		return
	}

	var todo model.Todo
	if err := json.NewDecoder(r.Body).Decode(&todo); err != nil {
		http.Error(w, "Invalid request body", http.StatusInternalServerError)
		return
	}
	db := database.DB

	if err := db.Create(&todo).Error; err != nil {
		http.Error(w, "Failed to save todo", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(todo)
	fmt.Println("データの登録が完了しました")
}

func corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3001") // ReactのURL
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == http.MethodOptions {
			// プリフライトリクエストのときは処理を止めてOKを返す
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	}
}
