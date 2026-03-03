<!-- NAV_TOP_START -->
[Previous](../09_맵/README.md) | [Index](../../00-index.md) | [Next](../11_인터페이스/README.md)
<!-- NAV_TOP_END -->

# 10. 구조체와 메서드

## 이전 챕터 점검 (01~09)
- [ ] 값/포인터, slice/map 규칙을 코드로 설명 가능하다.

## 학습 목표
- 구조체 중심으로 도메인 모델을 만든다.

## 핵심 내용
- 값 리시버 vs 포인터 리시버
- 임베딩과 메서드 승격
- 공개 필드/JSON 태그

## 예제 코드
```go
package main

import "fmt"

type Logger struct{}
func (Logger) Info(msg string) { fmt.Println("INFO:", msg) }

type User struct {
	Logger
	Name string `json:"name"`
	Age  int    `json:"age"`
}

func (u User) IsAdult() bool { return u.Age >= 19 }
func (u *User) Birthday()    { u.Age++ }

func main() {
	u := User{Name: "lee", Age: 18}
	u.Info("created")
	u.Birthday()
	fmt.Println(u.IsAdult())
}
```

## 실습
- 구조체 2개를 임베딩으로 조합해 도메인 타입을 만든다.

## 완료 기준
- [ ] 리시버 선택 근거를 설명할 수 있다.
- [ ] JSON 태그를 올바르게 적용했다.

<!-- NAV_BOTTOM_START -->
[Previous](../09_맵/README.md) | [Index](../../00-index.md) | [Next](../11_인터페이스/README.md)
<!-- NAV_BOTTOM_END -->

