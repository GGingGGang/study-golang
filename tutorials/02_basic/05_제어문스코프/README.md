# 05. 제어문과 스코프

## 이전 챕터 점검 (01~04)
- [ ] 타입 변환과 에러 처리 기본이 된다.

## 학습 목표
- if/for/switch를 스코프와 함께 안전하게 사용한다.

## 핵심 내용
- 블록 스코프와 shadowing
- switch 조건식 패턴
- 반복문 종료 조건 명확화

## 예제 코드
```go
package main

import "fmt"

func grade(score int) string {
	switch {
	case score >= 90:
		return "A"
	case score >= 80:
		return "B"
	default:
		return "C"
	}
}

func main() {
	total := 0
	for i := 1; i <= 5; i++ {
		total += i
	}
	fmt.Println(total, grade(83))
}
```

## 실습
- shadowing 버그(`err :=`)를 의도적으로 만들고 수정한다.

## 완료 기준
- [ ] shadowing 위험을 설명할 수 있다.
- [ ] 제어문 테스트를 2개 이상 작성했다.
