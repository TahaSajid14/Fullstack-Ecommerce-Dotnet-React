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
    public class OrderController : ControllerBase
    {

        private readonly AppDbContext _context;

        public OrderController(AppDbContext context)
        {
            _context = context;
        }
        [HttpGet("my-orders")]
        public async Task<IActionResult> GetMyOrders()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
                return Unauthorized();

            var orders = await _context.Orders
                .Where(o => o.UserId == userId)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            return Ok(orders);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(
    int id,
    [FromBody] string status)
        {
            var order = await _context.Orders.FindAsync(id);

            if (order == null)
                return NotFound("Order not found.");

            var allowedStatuses = new[]
            {
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled"
    };

            if (!allowedStatuses.Contains(status))
                return BadRequest("Invalid order status.");

            order.Status = status;

            await _context.SaveChangesAsync();

            return Ok("Order status updated successfully.");
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("all")]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            return Ok(orders);
        }

        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
                return Unauthorized();

            var cartItems = await _context.CartItems
                .Where(x => x.UserId == userId)
                .Include(x => x.Product)
                .ToListAsync();

            if (!cartItems.Any())
                return BadRequest("Cart is empty.");

            // Check stock first
            foreach (var item in cartItems)
            {
                if (item.Quantity > item.Product.Stock)
                {
                    return BadRequest(
                        $"Not enough stock for {item.Product.Name}."
                    );
                }
            }

            var order = new Order
            {
                UserId = userId,
                OrderDate = DateTime.UtcNow,
                Status = "Pending",
                TotalAmount = cartItems.Sum(x =>
                    x.Product.Price * x.Quantity),

                OrderItems = cartItems.Select(x => new OrderItem
                {
                    ProductId = x.ProductId,
                    Quantity = x.Quantity,
                    Price = x.Product.Price
                }).ToList()
            };

            // Reduce product stock
            foreach (var item in cartItems)
            {
                item.Product.Stock -= item.Quantity;
            }

            _context.Orders.Add(order);

            // Clear cart
            _context.CartItems.RemoveRange(cartItems);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Order placed successfully",
                orderId = order.Id,
                total = order.TotalAmount
            });
        }
    }
}