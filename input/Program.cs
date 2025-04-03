using System;

namespace ProjetoCompras
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Bem-vindo ao sistema de compras!");

            // Ler o CNPJ do usuário
            Console.Write("Digite seu CNPJ numérico (apenas números): ");
            string cnpj = Console.ReadLine();

            if (ValidarCNPJ(cnpj))
            {
                Console.WriteLine($"CNPJ válido: {cnpj}");
                // Simulação de compra
                Console.WriteLine("Realizando compras...");
                Console.WriteLine("Compra realizada com sucesso!");
            }
            else
            {
                Console.WriteLine("CNPJ inválido! Certifique-se de que possui 14 números.");
            }
        }

        // Método para validar o CNPJ numérico
        static bool ValidarCNPJ(string cnpj)
        {
            // Verificar se o CNPJ contém exatamente 14 dígitos numéricos
            if (cnpj.Length != 14 || !long.TryParse(cnpj, out _))
            {
                return false;
            }

            // Pesos para o primeiro dígito verificador
            int[] pesosPrimeiroDV = { 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 };

            // Pesos para o segundo dígito verificador
            int[] pesosSegundoDV = { 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 };

            // Calcular o primeiro dígito verificador
            int primeiroDV = CalcularDV(cnpj.Substring(0, 12), pesosPrimeiroDV);

            // Calcular o segundo dígito verificador
            int segundoDV = CalcularDV(cnpj.Substring(0, 12) + primeiroDV, pesosSegundoDV);

            // Verificar se os dígitos calculados correspondem aos dígitos fornecidos
            return cnpj.EndsWith($"{primeiroDV}{segundoDV}");
        }

        // Método para calcular o dígito verificador
        static int CalcularDV(string cnpjParcial, int[] pesos)
        {
            int soma = 0;

            for (int i = 0; i < cnpjParcial.Length; i++)
            {
                soma += (cnpjParcial[i] - '0') * pesos[i];
            }

            int resto = soma % 11;

            // Regra: Se o resto for menor que 2, o dígito verificador será 0; caso contrário, será 11 - resto
            return resto < 2 ? 0 : 11 - resto;
        }
    }
}