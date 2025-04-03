using System;
using System.Linq;

namespace ProjetoCompras
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Bem-vindo ao sistema de compras!");

            // Ler o CNPJ do usuário
            Console.Write("Digite seu CNPJ alfanumérico: ");
            string cnpj = Console.ReadLine();

            if (ValidarCNPJAlfanumerico(cnpj))
            {
                Console.WriteLine($"CNPJ válido: {cnpj}");
                // Simulação de compra
                Console.WriteLine("Realizando compras...");
                Console.WriteLine("Compra realizada com sucesso!");
            }
            else
            {
                Console.WriteLine("CNPJ inválido! Certifique-se de que possui 12 caracteres alfanuméricos.");
            }
        }

        // Método para validar o CNPJ alfanumérico
        static bool ValidarCNPJAlfanumerico(string cnpj)
        {
            if (cnpj.Length != 12 || !cnpj.All(char.IsLetterOrDigit))
            {
                return false;
            }

            string cnpjNumerico = ConverterParaNumerico(cnpj);
            if (cnpjNumerico.Length != 12) return false;

            // Pesos para o primeiro dígito verificador
            int[] pesosPrimeiroDV = { 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 };

            // Pesos para o segundo dígito verificador
            int[] pesosSegundoDV = { 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 };

            // Calcular o primeiro dígito verificador
            int primeiroDV = CalcularDV(cnpjNumerico, pesosPrimeiroDV);

            // Calcular o segundo dígito verificador
            int segundoDV = CalcularDV(cnpjNumerico + primeiroDV, pesosSegundoDV);

            // Verificar se os dígitos calculados correspondem aos dígitos fornecidos
            return cnpj.EndsWith($"{primeiroDV}{segundoDV}");
        }

        // Método para converter o CNPJ alfanumérico para numérico
        static string ConverterParaNumerico(string cnpj)
        {
            return new string(cnpj.Select(c =>
            {
                if (char.IsDigit(c)) return c;
                if (char.IsLetter(c) && char.IsUpper(c)) return (char)((c - 'A') + 17 + '0');
                return '\0'; // Caractere inválido
            }).Where(c => c != '\0').ToArray());
        }

        // Método para calcular o dígito verificador
        static int CalcularDV(string cnpjParcial, int[] pesos)
        {
            int soma = cnpjParcial.Select((c, index) => (c - '0') * pesos[index]).Sum();
            int resto = soma % 11;
            return resto < 2 ? 0 : 11 - resto;
        }
    }
}