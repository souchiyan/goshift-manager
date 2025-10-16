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
	http.HandleFunc("/show", corsMiddleware(getTodoHandler))
	http.HandleFunc("/delete/", corsMiddleware(deleteTodoHandler))
	log.Fatal(http.ListenAndServe(":8080", nil))
	fmt.Println("localhost:8080で起動中")

}

func postTodoHandler(w http.ResponseWriter, r *http.Request) {
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

func getTodoHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "このメソッドは許可されていません", http.StatusInternalServerError)
		return
	}
	var todos []model.Todo

	db := database.DB
	if err := db.Find(&todos).Error; err != nil {
		http.Error(w, "データを表示できません", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(todos)

	fmt.Println("データベースからの送信完了")
}

func deleteTodoHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		http.Error(w, "このメソッドは許可されていません", http.StatusInternalServerError)
		return
	}

	id := r.URL.Path[len("/delete/"):]
	db := database.DB
	if err := db.Delete(&model.Todo{}, id).Error; err != nil {
		http.Error(w, "データベースの削除に失敗しました。存在しません", http.StatusInternalServerError)
	}

	fmt.Println("データの削除に成功しました")

}

func corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3001") // ReactのURL
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Set("Content-Type", "application/json")

		if r.Method == http.MethodOptions {
			// プリフライトリクエストのときは処理を止めてOKを返す
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	}
}
