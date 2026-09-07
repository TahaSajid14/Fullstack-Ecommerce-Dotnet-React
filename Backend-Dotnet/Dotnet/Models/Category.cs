namespace Dotnet.Models
{
    public class Category
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        // One category can have many products
        public ICollection<Products>? Products { get; set; } = new List<Products>();
    }
}

