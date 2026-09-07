using Microsoft.AspNetCore.Identity;
namespace Dotnet.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string FirstName { get; set; } = string.Empty;
    }
}
