function _validarCNPJAlfanumerico(cnpj: string): boolean {
    if (cnpj.length !== 12) return false;

    const pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    const cnpjNumerico = _converterParaNumerico(cnpj);
    if (cnpjNumerico.length !== 12) return false;

    // Calcular o primeiro dígito verificador
    const primeiroDV = _calcularDV(cnpjNumerico, pesos1);

    // Calcular o segundo dígito verificador
    const segundoDV = _calcularDV(cnpjNumerico + primeiroDV, pesos2);

    const cnpjCompleto = cnpjNumerico + primeiroDV + segundoDV;

    // Comparar os dois últimos dígitos com os dígitos informados no CNPJ original
    const digitosInformados = cnpj.slice(-2);
    return cnpjCompleto.slice(-2) === digitosInformados;
}

function _converterParaNumerico(cnpj: string): string {
    return cnpj
        .split('')
        .map((char) => {
            if (/\d/.test(char)) return char;
            if (/[A-Z]/.test(char))
                return (char.charCodeAt(0) - 65 + 17).toString();
            return ''; // Caractere inválido
        })
        .join('');
}

function _calcularDV(cnpj: string, pesos: number[]): number {
    const soma = cnpj.split('').reduce((acumulador, char, index) => {
        return acumulador + parseInt(char, 10) * pesos[index];
    }, 0);
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
}

// Exemplo de uso
const _exemploCNPJ = '12ABC34501DE';
if (_validarCNPJAlfanumerico(_exemploCNPJ)) {
    console.log('CNPJ válido');
} else {
    console.log('CNPJ inválido');
}
