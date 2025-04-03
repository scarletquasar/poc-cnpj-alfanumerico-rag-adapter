function validarCNPJAlfanumerico(cnpj) {
    if (cnpj.length !== 12) return false;

    const pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    const cnpjNumerico = converterParaNumerico(cnpj);
    if (cnpjNumerico.length !== 12) return false;

    // Calcular o primeiro dígito verificador
    const primeiroDV = calcularDV(cnpjNumerico, pesos1);

    // Calcular o segundo dígito verificador
    const segundoDV = calcularDV(cnpjNumerico + primeiroDV, pesos2);

    const cnpjCompleto = cnpjNumerico + primeiroDV + segundoDV;

    // Comparar com os últimos dígitos informados no CNPJ original
    const digitosInformados = cnpj.slice(-2); // Os dois últimos caracteres do CNPJ original
    return cnpjCompleto.slice(-2) === digitosInformados;
}

function converterParaNumerico(cnpj) {
    return cnpj
        .split('')
        .map((char) => {
            if (/\d/.test(char)) return parseInt(char, 10);
            if (/[A-Z]/.test(char)) return char.charCodeAt(0) - 65 + 17;
            return -1; // Caractere inválido
        })
        .filter((valor) => valor >= 0)
        .join('');
}

function calcularDV(cnpj, pesos) {
    const soma = cnpj.split('').reduce((acum, char, index) => {
        return acum + char * pesos[index];
    }, 0);
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
}

// Exemplo de uso
const exemploCNPJ = '12ABC34501DE';
if (validarCNPJAlfanumerico(exemploCNPJ)) {
    console.log('CNPJ válido');
} else {
    console.log('CNPJ inválido');
}
