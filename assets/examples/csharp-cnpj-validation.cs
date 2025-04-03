using System;
using System.Linq;

class Program
{
    public static void Main(string[] args)
    {
        string cnpj = "12ABC34501DE"; // Exemplo de CNPJ alfanumérico
        bool isValid = ValidateCNPJ(cnpj);
        Console.WriteLine(isValid ? "CNPJ válido" : "CNPJ inválido");
    }

    public static bool ValidateCNPJ(string cnpj)
    {
        if (cnpj.Length != 12) return false;

        int[] weights1 = { 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 };
        int[] weights2 = { 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 };

        string numericCNPJ = ConvertToNumeric(cnpj);
        if (numericCNPJ.Length != 12) return false;

        // Calcular o primeiro dígito verificador
        int firstDV = CalculateDV(numericCNPJ, weights1);
        // Calcular o segundo dígito verificador
        int secondDV = CalculateDV(numericCNPJ + firstDV, weights2);

        string completeCNPJ = numericCNPJ + firstDV + secondDV;

        return completeCNPJ.EndsWith(cnpj.Substring(cnpj.Length - 2));
    }

    private static string ConvertToNumeric(string cnpj)
    {
        return string.Concat(cnpj.Select(c =>
        {
            if (char.IsDigit(c)) return c - '0';
            if (char.IsLetter(c)) return (c - 'A') + 17;
            return -1; // Caracter inválido
        }).Where(v => v >= 0));
    }

    private static int CalculateDV(string cnpj, int[] weights)
    {
        int sum = cnpj.Select((c, index) => (c - '0') * weights[index]).Sum();
        int remainder = sum % 11;
        return (remainder < 2) ? 0 : 11 - remainder;
    }
}