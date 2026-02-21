# 25. 동시성 패턴

## 이전 챕터 점검 (01~24)
- [ ] 24장에서 공유 상태 보호 코드를 작성했다.

## 학습 목표
- worker pool/pipeline 패턴을 구현한다.

## 핵심 내용
- 작업 큐
- worker 고정 개수
- 결과 수집과 종료

## 예제 코드
```go
package main

import "fmt"

func worker(id int, jobs <-chan int, results chan<- int) {
	for j := range jobs {
		results <- j * j
		_ = id
	}
}

func main() {
	jobs := make(chan int, 5)
	results := make(chan int, 5)

	for w := 1; w <= 2; w++ {
		go worker(w, jobs, results)
	}
	for j := 1; j <= 5; j++ {
		jobs <- j
	}
	close(jobs)

	for i := 0; i < 5; i++ {
		fmt.Println(<-results)
	}
}
```

## 실습
- context 취소를 추가해 worker pool을 중단 가능하게 만든다.

## 완료 기준
- [ ] 작업 분배와 결과 수집이 동작한다.
- [ ] 중단 시 누수가 없다.
- [ ] 테스트로 종료를 검증했다.
