using System;
using System.Linq;

class TransferenciaBancaria
{
    public string CNPJ { get; set; }
    public decimal Valor { get; set; }
    public string BancoDestino { get; set; }
    public string ContaDestino { get; set; }

    public TransferenciaBancaria(string cnpj, decimal valor, string bancoDestino, string contaDestino)
    {
        CNPJ = cnpj;
        Valor = valor;
        BancoDestino = bancoDestino;
        ContaDestino = contaDestino;
    }

    public bool ValidarCNPJAlfanumerico()
    {
        if (CNPJ.Length != 12 || !CNPJ.All(char.IsLetterOrDigit))
        {
            return false;
        }

        string cnpjNumerico = ConverterParaNumerico(CNPJ);
        if (cnpjNumerico.Length != 12) return false;

        // Cálculo do primeiro dígito verificador
        int[] pesos1 = { 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 };
        int primeiroDV = CalcularDV(cnpjNumerico, pesos1);

        // Cálculo do segundo dígito verificador
        int[] pesos2 = { 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 };
        int segundoDV = CalcularDV(cnpjNumerico + primeiroDV, pesos2);

        return CNPJ.EndsWith($"{primeiroDV}{segundoDV}");
    }

    private string ConverterParaNumerico(string cnpj)
    {
        return new string(cnpj.Select(c =>
        {
            if (char.IsDigit(c)) return c;
            if (char.IsLetter(c) && char.IsUpper(c)) return (char)((c - 'A') + 17 + '0');
            return '\0'; // Caractere inválido
        }).Where(c => c != '\0').ToArray());
    }

    private int CalcularDV(string cnpj, int[] pesos)
    {
        int soma = cnpj.Select((c, index) => (c - '0') * pesos[index]).Sum();
        int resto = soma % 11;
        return resto < 2 ? 0 : 11 - resto;
    }

    public void RealizarTransferencia()
    {
        if (!ValidarCNPJAlfanumerico())
        {
            Console.WriteLine("CNPJ alfanumérico inválido. Operação cancelada.");
            return;
        }

        Console.WriteLine($"Transferência de R$ {Valor:F2} realizada com sucesso!");
        Console.WriteLine($"Banco: {BancoDestino}");
        Console.WriteLine($"Conta: {ContaDestino}");
        Console.WriteLine($"CNPJ do remetente: {CNPJ}");
    }
}

class Program
{
    static void Main(string[] args)
    {
        string cnpj = "12ABC34501DE"; // Novo CNPJ alfanumérico
        decimal valor = 500.00m; // Valor da transferência
        string bancoDestino = "Banco XYZ"; // Banco de destino
        string contaDestino = "123456-7"; // Conta de destino

        TransferenciaBancaria transferencia = new TransferenciaBancaria(cnpj, valor, bancoDestino, contaDestino);
        transferencia.RealizarTransferencia();
    }
}