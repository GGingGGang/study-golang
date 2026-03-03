<!-- NAV_TOP_START -->
[Previous](../13_모듈관리/README.md) | [Index](../../00-index.md) | [Next](../15_프로젝트구조/README.md)
<!-- NAV_TOP_END -->

# 14. 패키지 분리

## 이전 챕터 점검 (01~13)
- [ ] 13장에서 만든 모듈에서 테스트가 통과한다.
- [ ] `go mod tidy`가 깨끗하게 동작한다.

## 학습 목표
- 패키지를 책임 단위로 분리한다.
- `internal`로 내부 구현을 보호한다.

## 핵심 내용
- 외부 공개 API와 내부 구현 분리
- `internal` 패키지는 모듈 외부 접근 불가
- 순환 의존(cycle) 금지

## 예제 코드
```go
package service

import "example.com/study14/internal/validator"

type UserService struct{}

func (UserService) ValidateName(name string) bool {
	return validator.NonEmpty(name)
}
```

```go
package validator

func NonEmpty(s string) bool {
	return len(s) > 0
}
```

## 실습
- `service`, `internal/validator` 패키지를 만들고 호출 연결
- 패키지 간 import 방향을 그림으로 정리

## 완료 기준
- [ ] internal 사용 이유를 설명할 수 있다.
- [ ] 패키지 순환 의존 없이 빌드된다.
- [ ] 최소 1개 단위 테스트를 추가했다.

<!-- NAV_BOTTOM_START -->
[Previous](../13_모듈관리/README.md) | [Index](../../00-index.md) | [Next](../15_프로젝트구조/README.md)
<!-- NAV_BOTTOM_END -->

