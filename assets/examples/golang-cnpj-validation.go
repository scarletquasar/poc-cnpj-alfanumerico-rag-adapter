package main

import (
    "fmt"
    "unicode"
)

func main() {
    cnpj := "12ABC34501DE" // Exemplo de CNPJ alfanumérico
    if validarCNPJ(cnpj) {
        fmt.Println("CNPJ válido")
    } else {
        fmt.Println("CNPJ inválido")
    }
}

func validarCNPJ(cnpj string) bool {
    if len(cnpj) != 12 {
        return false
    }

    // Pesos para o cálculo dos dígitos verificadores
    pesos1 := []int{5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2}
    pesos2 := []int{6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2}

    cnpjNumerico := converterParaNumerico(cnpj)
    if len(cnpjNumerico) != 12 {
        return false
    }

    // Calcular o primeiro dígito verificador
    primeiroDV := calcularDV(cnpjNumerico, pesos1)

    // Calcular o segundo dígito verificador
    segundoDV := calcularDV(cnpjNumerico+fmt.Sprint(primeiroDV), pesos2)

    // Verificar os dois dígitos finais
    return cnpjNumerico+fmt.Sprint(primeiroDV)+fmt.Sprint(segundoDV) == converterParaNumerico(cnpj)+cnpj[len(cnpj)-2:]
}

func converterParaNumerico(cnpj string) string {
    var numerico string
    for _, char := range cnpj {
        if unicode.IsDigit(char) {
            numerico += string(char)
        } else if unicode.IsLetter(char) && unicode.IsUpper(char) {
            numerico += fmt.Sprint(int(char-'A') + 17)
        } else {
            return ""
        }
    }
    return numerico
}

func calcularDV(cnpj string, pesos []int) int {
    soma := 0
    for i, char := range cnpj {
        valor := int(char - '0')
        soma += valor * pesos[i]
    }
    resto := soma % 11
    if resto < 2 {
        return 0
    }
    return 11 - resto
}