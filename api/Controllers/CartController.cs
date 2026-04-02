using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Data;
using api.DTOs;
using api.Models;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CartController : ControllerBase
    {
        private readonly AppDbContext _context;
        private const string HardcodedUserId = "student123";

        public CartController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<CartResponse>> GetCart()
        {
            var cart = await GetOrCreateCartAsync();

            return Ok(MapCartResponse(cart));
        }

        [HttpPost]
        public async Task<ActionResult<CartResponse>> AddToCart([FromBody] AddToCartRequest request)
        {
            if (request.ProductId <= 0 || request.Quantity < 1)
            {
                return BadRequest("ProductId must be positive and Quantity must be at least 1.");
            }

            var product = await _context.Products.FindAsync(request.ProductId);
            if (product == null)
            {
                return NotFound("Product not found.");
            }

            var cart = await GetOrCreateCartAsync();

            var existingItem = await _context.CartItems
                .FirstOrDefaultAsync(ci => ci.CartId == cart.Id && ci.ProductId == request.ProductId);

            if (existingItem != null)
            {
                existingItem.Quantity += request.Quantity;
            }
            else
            {
                var cartItem = new CartItem
                {
                    CartId = cart.Id,
                    ProductId = request.ProductId,
                    Quantity = request.Quantity
                };

                _context.CartItems.Add(cartItem);
            }

            await _context.SaveChangesAsync();

            cart = await LoadCartAsync(cart.Id);

            return CreatedAtAction(nameof(GetCart), MapCartResponse(cart));
        }

        [HttpPut("{cartItemId:int}")]
        public async Task<ActionResult<CartResponse>> UpdateCartItem(int cartItemId, [FromBody] UpdateCartItemRequest request)
        {
            if (request.Quantity < 1)
            {
                return BadRequest("Quantity must be at least 1.");
            }

            var cart = await GetOrCreateCartAsync();

            var item = await _context.CartItems
                .FirstOrDefaultAsync(ci => ci.Id == cartItemId && ci.CartId == cart.Id);

            if (item == null)
            {
                return NotFound("Cart item not found.");
            }

            item.Quantity = request.Quantity;
            await _context.SaveChangesAsync();

            cart = await LoadCartAsync(cart.Id);

            return Ok(MapCartResponse(cart));
        }

        [HttpDelete("{cartItemId:int}")]
        public async Task<ActionResult<CartResponse>> RemoveCartItem(int cartItemId)
        {
            var cart = await GetOrCreateCartAsync();

            var item = await _context.CartItems
                .FirstOrDefaultAsync(ci => ci.Id == cartItemId && ci.CartId == cart.Id);

            if (item == null)
            {
                return NotFound("Cart item not found.");
            }

            _context.CartItems.Remove(item);
            await _context.SaveChangesAsync();

            cart = await LoadCartAsync(cart.Id);

            return Ok(MapCartResponse(cart));
        }

        [HttpDelete("clear")]
        public async Task<ActionResult<CartResponse>> ClearCart()
        {
            var cart = await GetOrCreateCartAsync();

            var items = await _context.CartItems
                .Where(ci => ci.CartId == cart.Id)
                .ToListAsync();

            _context.CartItems.RemoveRange(items);
            await _context.SaveChangesAsync();

            cart = await LoadCartAsync(cart.Id);

            return Ok(MapCartResponse(cart));
        }

        private async Task<Cart> GetOrCreateCartAsync()
        {
            var cart = await _context.Carts
                .Include(c => c.Items)
                .ThenInclude(ci => ci.Product)
                .FirstOrDefaultAsync(c => c.UserId == HardcodedUserId);

            if (cart != null)
            {
                return cart;
            }

            cart = new Cart
            {
                UserId = HardcodedUserId
            };

            _context.Carts.Add(cart);
            await _context.SaveChangesAsync();

            return await LoadCartAsync(cart.Id);
        }

        private async Task<Cart> LoadCartAsync(int cartId)
        {
            return await _context.Carts
                .Include(c => c.Items)
                .ThenInclude(ci => ci.Product)
                .FirstAsync(c => c.Id == cartId);
        }

        private static CartResponse MapCartResponse(Cart cart)
        {
            var items = cart.Items.Select(item => new CartItemResponse
            {
                CartItemId = item.Id,
                ProductId = item.ProductId,
                ProductName = item.Product?.Title ?? "",
                Price = item.Product?.Price ?? 0,
                ImageUrl = item.Product?.ImageUrl ?? "",
                Quantity = item.Quantity,
                LineTotal = (item.Product?.Price ?? 0) * item.Quantity
            }).ToList();

            return new CartResponse
            {
                CartId = cart.Id,
                UserId = cart.UserId,
                Items = items,
                TotalItems = items.Sum(i => i.Quantity),
                TotalPrice = items.Sum(i => i.LineTotal)
            };
        }
    }
}