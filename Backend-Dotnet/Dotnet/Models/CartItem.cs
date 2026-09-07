namespace Dotnet.Models
{
    public class CartItem
    {
   
            public int Id { get; set; }

            public string UserId { get; set; } = string.Empty;

            public int ProductId { get; set; }

            public int Quantity { get; set; }

            // Navigation
            public ApplicationUser User { get; set; } 

            public Products Product { get; set; } 
        }
    }
