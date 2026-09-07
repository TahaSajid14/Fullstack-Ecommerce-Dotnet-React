using Dotnet.DTOs;
using Dotnet.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using System.Security.Claims;

namespace Dotnet.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CartController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CartController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateQuantity(int id, AddToCartDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
                return Unauthorized();

            if (dto.Quantity <= 0)
                return BadRequest("Quantity must be greater than 0.");

            var cartItem = await _context.CartItems
                .FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);

            if (cartItem == null)
                return NotFound("Cart item not found.");

            cartItem.Quantity = dto.Quantity;

            await _context.SaveChangesAsync();

            return Ok("Cart quantity updated");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveFromCart(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
                return Unauthorized();

            var cartItem = await _context.CartItems
                .FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);

            if (cartItem == null)
                return NotFound("Cart item not found.");

            _context.CartItems.Remove(cartItem);

            await _context.SaveChangesAsync();

            return Ok("Product removed from cart");
        }

        [HttpGet]
        public async Task<IActionResult> GetCart()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                return Unauthorized();
            }

            var cartItems = await _context.CartItems
                .Where(x => x.UserId == userId)
                .Include(x => x.Product)
                .ThenInclude(p => p.Category)
                .ToListAsync();

            return Ok(cartItems);
        }

        [HttpPost]
        public async Task<IActionResult> AddToCart(AddToCartDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                return Unauthorized();
            }

            if (dto.Quantity <= 0)
            {
                return BadRequest("Quantity must be greater than 0.");
            }

            var product = await _context.Products.FindAsync(dto.ProductId);

            if (product == null)
            {
                return NotFound("Product not found.");
            }

            var existingItem = await _context.CartItems
                .FirstOrDefaultAsync(x =>
                    x.UserId == userId &&
                    x.ProductId == dto.ProductId);

            if (existingItem != null)
            {
                existingItem.Quantity += dto.Quantity;
            }
            else
            {
                var cartItem = new CartItem
                {
                    UserId = userId,
                    ProductId = dto.ProductId,
                    Quantity = dto.Quantity
                };

                _context.CartItems.Add(cartItem);
            }

            await _context.SaveChangesAsync();

            return Ok("Product added to cart");
        }
    }
}