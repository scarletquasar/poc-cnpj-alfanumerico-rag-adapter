using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Consulta.CNPJ.Models
{
    class Extra
    {
        [MaxLength(12)]
        public string CNPJ { get; set; }
    }
}