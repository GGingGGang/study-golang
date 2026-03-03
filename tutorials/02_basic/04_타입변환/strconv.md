<!-- NAV_TOP_START -->
[Previous](README.md) | [Index](../../00-index.md) | [Next](../05_제어문스코프/README.md)
<!-- NAV_TOP_END -->

# strconv 패키지 상세 정리

`strconv`는 문자열과 기본 타입(`bool`, 정수, 실수, 복소수, rune)의 변환을 담당하는 표준 패키지다.

핵심은 두 가지다.

1. 문자열을 안전하게 파싱한다. (`Parse*`, `Atoi`)
2. 타입 값을 목적에 맞게 문자열로 포매팅한다. (`Format*`, `Itoa`, `Append*`)

---

## 1. 형변환과 `strconv`의 차이

Go의 형변환은 "이미 숫자인 값"끼리 타입만 바꾸는 동작이다.

```go
f := float64(10) // int -> float64, 문자열 파싱 아님
```

문자열 `"10"`을 숫자 `10`으로 바꾸는 건 형변환이 아니라 파싱이고, 이때 `strconv`를 사용한다.

```go
n, err := strconv.Atoi("10")
```

정리:

- `float64(i)` 같은 문법은 타입 변환(cast)
- `strconv.Atoi("10")`는 문자열 파싱(parse)

---

## 2. 문자열 -> 타입 (파싱 계열)

## 2.1 `ParseBool`

```go
v, err := strconv.ParseBool("true")
```

허용 입력:

- true 계열: `1`, `t`, `T`, `TRUE`, `true`, `True`
- false 계열: `0`, `f`, `F`, `FALSE`, `false`, `False`

그 외 문자열은 에러다.

## 2.2 정수 파싱: `Atoi`, `ParseInt`, `ParseUint`

### `Atoi`

```go
n, err := strconv.Atoi("42")
```

- 10진 정수 문자열을 `int`로 파싱
- 내부적으로 `ParseInt(s, 10, 0)`와 같은 의미
- 반환 타입이 `int`라서 플랫폼 비트수(32/64)에 영향을 받는다

### `ParseInt`

```go
v, err := strconv.ParseInt("0xff", 0, 64) // 255
```

시그니처:

```go
func ParseInt(s string, base int, bitSize int) (i int64, err error)
```

중요 파라미터:

- `base`
- `2` ~ `36`: 고정 진법
- `0`: 문자열 접두사로 진법 자동 감지
- `0b` -> 2진, `0o` 또는 `0` -> 8진, `0x` -> 16진, 그 외 -> 10진
- `bitSize`
- 결과를 해당 signed 정수 범위로 제한
- `0`, `8`, `16`, `32`, `64` 사용
- 범위를 넘으면 `ErrRange` 에러와 함께 클램프된 값(최댓값/최솟값)이 반환된다

참고:

- `base == 0`일 때만 Go 정수 리터럴 규칙의 `_`(언더스코어) 구분자를 허용한다

### `ParseUint`

```go
u, err := strconv.ParseUint("ff", 16, 32) // 255
```

- 부호 없는 정수 파싱
- `+`/`-` 부호는 허용되지 않는다
- 진법/비트 처리 방식은 `ParseInt`와 동일

## 2.3 실수/복소수 파싱: `ParseFloat`, `ParseComplex`

### `ParseFloat`

```go
f64, err := strconv.ParseFloat("3.14159", 64)
f32, err := strconv.ParseFloat("3.14159", 32)
```

특징:

- 10진 실수와 16진 실수 표기를 지원
- `NaN`, `Inf`, `+Inf`, `-Inf` 인식
- `bitSize=32`면 `float32` 정밀도로 반올림된 값을 반환(타입은 `float64`)
- 범위 초과 시 `ErrRange`

### `ParseComplex`

```go
c, err := strconv.ParseComplex("1.5-2.5i", 128)
```

특징:

- 형식: `N`, `Ni`, `N+Ni`, `N-Ni` (여기서 `N`은 `ParseFloat`가 허용하는 형태)
- `bitSize=64`면 `complex64` 정밀도 기준, `128`이면 `complex128` 기준

---

## 3. 타입 -> 문자열 (포매팅 계열)

## 3.1 불리언/정수

```go
s1 := strconv.FormatBool(true)     // "true"
s2 := strconv.Itoa(42)             // "42"
s3 := strconv.FormatInt(-42, 10)   // "-42"
s4 := strconv.FormatUint(255, 16)  // "ff"
```

- `Itoa`는 `int -> string` 빠른 헬퍼
- 다양한 진법 출력은 `FormatInt`, `FormatUint` 사용

## 3.2 실수/복소수

```go
s := strconv.FormatFloat(123.456, 'f', 2, 64) // "123.46"
```

`FormatFloat` 형식 문자:

- `'b'`: 지수 기반 2의 거듭제곱 형식
- `'e'`, `'E'`: 과학적 표기
- `'f'`: 소수점 고정
- `'g'`, `'G'`: 자릿수에 따라 `e/f` 중 더 짧은 형태
- `'x'`, `'X'`: 16진 부동소수점 표기

`prec`:

- `f/e/E/x/X`: 소수점 이하 자릿수
- `g/G`: 유효 숫자 자리수
- `-1`: 값이 보존되는 최소 자릿수로 자동 선택

`bitSize`:

- `32` 또는 `64`
- `float32` 값이면 `32`를 주는 것이 의도를 명확히 전달한다

`FormatComplex`는 내부적으로 실수부/허수부를 `FormatFloat` 규칙으로 포매팅한다.

---

## 4. 문자열 리터럴 처리: `Quote` / `Unquote`

로그, 디버깅, 코드 생성 시 매우 유용하다.

```go
q := strconv.Quote("Hello\tGo")    // "\"Hello\\tGo\""
u, _ := strconv.Unquote(q)         // "Hello\tGo"
```

주요 함수:

- `Quote`, `QuoteToASCII`, `QuoteToGraphic`
- `QuoteRune`, `QuoteRuneToASCII`, `QuoteRuneToGraphic`
- `CanBackquote`: raw string(`...`)로 안전 표현 가능한지 확인
- `Unquote`: 따옴표 포함 리터럴을 실제 문자열로 복원
- `UnquoteChar`: 이스케이프 시퀀스 1개 단위 디코딩

---

## 5. 성능 포인트: `Append*` 계열

`Format*`은 새 문자열을 만든다. 고성능 경로에서는 `[]byte` 버퍼에 바로 붙이는 `Append*`가 유리하다.

```go
buf := make([]byte, 0, 64)
buf = strconv.AppendInt(buf, 2026, 10)
buf = append(buf, ',')
buf = strconv.AppendBool(buf, true)
result := string(buf) // "2026,true"
```

자주 쓰는 함수:

- `AppendInt`, `AppendUint`, `AppendFloat`, `AppendBool`
- `AppendQuote`, `AppendQuoteRune` 계열

---

## 6. 에러 처리 핵심 (`NumError`)

숫자 파싱 에러는 보통 `*strconv.NumError` 형태다.

```go
n, err := strconv.Atoi("999999999999999999999999")
if err != nil {
	var numErr *strconv.NumError
	if errors.As(err, &numErr) {
		fmt.Println("Func:", numErr.Func) // 예: Atoi, ParseInt
		fmt.Println("Num:", numErr.Num)   // 원본 입력
		fmt.Println("Err:", numErr.Err)   // ErrSyntax 또는 ErrRange
	}
}
```

판별 포인트:

- `errors.Is(err, strconv.ErrSyntax)`: 문법 오류
- `errors.Is(err, strconv.ErrRange)`: 범위 초과

실무 팁:

- 사용자 입력 파싱 전 `strings.TrimSpace`로 공백 정리
- `Atoi`만 고집하지 말고 요구사항이 진법/범위에 민감하면 `ParseInt/ParseUint`를 직접 사용

---

## 7. 실전 예제: 안전한 포트 파싱

```go
package main

import (
	"errors"
	"fmt"
	"strconv"
	"strings"
)

func parsePort(s string) (uint16, error) {
	s = strings.TrimSpace(s)

	v, err := strconv.ParseUint(s, 10, 16)
	if err != nil {
		if errors.Is(err, strconv.ErrSyntax) {
			return 0, fmt.Errorf("포트는 숫자여야 합니다: %w", err)
		}
		if errors.Is(err, strconv.ErrRange) {
			return 0, fmt.Errorf("포트 범위(0~65535)를 벗어났습니다: %w", err)
		}
		return 0, err
	}

	return uint16(v), nil
}
```

---

## 8. 빠른 선택 가이드

- 문자열 정수 -> `int`: `Atoi`
- 문자열 정수 -> 지정 비트 정수: `ParseInt`, `ParseUint`
- 문자열 실수: `ParseFloat`
- 숫자 -> 문자열: `Itoa`, `FormatInt`, `FormatFloat`
- 버퍼 기반 고성능 직렬화: `Append*`
- 문자열 리터럴 이스케이프/복원: `Quote*`, `Unquote*`

`strconv`를 제대로 이해하면 입력 검증, 설정 파일 처리, 로그 포매팅에서 버그를 크게 줄일 수 있다.

<!-- NAV_BOTTOM_START -->
[Previous](README.md) | [Index](../../00-index.md) | [Next](../05_제어문스코프/README.md)
<!-- NAV_BOTTOM_END -->

