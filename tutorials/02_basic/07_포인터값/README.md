# 07. 포인터와 값

## 이전 챕터 점검 (01~06)
- [ ] 함수 인자와 반환 구조를 명확히 설명할 수 있다.

## 학습 목표
- 값 복사와 포인터 공유의 차이를 이해한다.

## 핵심 내용
- 값 전달은 복사
- 포인터 전달은 원본 수정 가능
- 상태 변경이 필요한 경우만 포인터 사용

## 예제 코드
```go
package main

import "fmt"

type User struct {
	Name string
	Age  int
}

func byValue(u User)  { u.Age++ }
func byPointer(u *User) { u.Age++ }

func main() {
	u := User{Name: "kim", Age: 20}
	byValue(u)
	fmt.Println(u.Age) // 20
	byPointer(&u)
	fmt.Println(u.Age) // 21
}
```

## 실습
- 같은 패턴을 slice/map에도 적용해 side effect 차이를 기록한다.

## 완료 기준
- [ ] 포인터 사용 기준을 문장으로 정리했다.
- [ ] 값/포인터 테스트를 모두 통과했다.
