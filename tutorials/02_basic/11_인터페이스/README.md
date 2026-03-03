<!-- NAV_TOP_START -->
[Previous](../10_구조체메서드/README.md) | [Index](../../00-index.md) | [Next](../12_에러처리/README.md)
<!-- NAV_TOP_END -->

# 11. 인터페이스

## 이전 챕터 점검 (01~10)
- [ ] 구조체/메서드로 기본 도메인 모델을 만들 수 있다.

## 학습 목표
- 작은 인터페이스로 결합도를 낮춘다.

## 핵심 내용
- 구현보다 행동(메서드 집합)
- 호출자 쪽 인터페이스 정의
- 테스트 더블로 검증

## 예제 코드
```go
package main

import "fmt"

type Notifier interface {
	Notify(msg string) error
}

type ConsoleNotifier struct{}
func (ConsoleNotifier) Notify(msg string) error {
	fmt.Println(msg)
	return nil
}

func SendWelcome(n Notifier, user string) error {
	return n.Notify("welcome " + user)
}
```

```go
package main

import "testing"

type fakeNotifier struct{ called bool }
func (f *fakeNotifier) Notify(string) error { f.called = true; return nil }

func TestSendWelcome(t *testing.T) {
	f := &fakeNotifier{}
	if err := SendWelcome(f, "kim"); err != nil {
		t.Fatal(err)
	}
	if !f.called {
		t.Fatal("not called")
	}
}
```

## 완료 기준
- [ ] 인터페이스를 필요한 위치(소비자 쪽)에 정의했다.
- [ ] 테스트 더블로 동작을 검증했다.

<!-- NAV_BOTTOM_START -->
[Previous](../10_구조체메서드/README.md) | [Index](../../00-index.md) | [Next](../12_에러처리/README.md)
<!-- NAV_BOTTOM_END -->

