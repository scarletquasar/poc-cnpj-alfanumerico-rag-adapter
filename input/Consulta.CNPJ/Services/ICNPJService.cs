using Consulta.CNPJ.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Consulta.CNPJ.Services
{
    public interface ICNPJService
    {
        CNPJResult ConsultarCNPJ(string cnpj);
        Task<CNPJResult> ConsultarCNPJAsync(string cnpj);
        bool ValidarCNPJAlfanumerico(string cnpj);
        string ConverterParaNumerico(string cnpj);
        int CalcularDV(string cnpj, int[] pesos);
    }

    public class CNPJService : ICNPJService
    {
        public CNPJResult ConsultarCNPJ(string cnpj)
        {
            if (!ValidarCNPJAlfanumerico(cnpj))
            {
                throw new ArgumentException("CNPJ alfanumérico inválido.");
            }

            // Implementar a lógica de consulta do CNPJ
            return new CNPJResult();
        }

        public async Task<CNPJResult> ConsultarCNPJAsync(string cnpj)
        {
            if (!ValidarCNPJAlfanumerico(cnpj))
            {
                throw new ArgumentException("CNPJ alfanumérico inválido.");
            }

            // Implementar a lógica de consulta assíncrona do CNPJ
            return await Task.FromResult(new CNPJResult());
        }

        public bool ValidarCNPJAlfanumerico(string cnpj)
        {
            if (cnpj.Length != 12 || !cnpj.All(char.IsLetterOrDigit))
            {
                return false;
            }

            string cnpjNumerico = ConverterParaNumerico(cnpj);
            if (cnpjNumerico.Length != 12) return false;

            int[] pesos1 = { 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 };
            int primeiroDV = CalcularDV(cnpjNumerico, pesos1);

            int[] pesos2 = { 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 };
            int segundoDV = CalcularDV(cnpjNumerico + primeiroDV, pesos2);

            return cnpj.EndsWith($"{primeiroDV}{segundoDV}");
        }

        public string ConverterParaNumerico(string cnpj)
        {
            return new string(cnpj.Select(c =>
            {
                if (char.IsDigit(c)) return c;
                if (char.IsLetter(c) && char.IsUpper(c)) return (char)((c - 'A') + 17 + '0');
                return '\0';
            }).Where(c => c != '\0').ToArray());
        }

        public int CalcularDV(string cnpj, int[] pesos)
        {
            int soma = cnpj.Select((c, index) => (c - '0') * pesos[index]).Sum();
            int resto = soma % 11;
            return resto < 2 ? 0 : 11 - resto;
        }
    }
}