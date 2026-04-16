using System.Net.Http.Headers;
using System.Net.Http.Json;
using FluentAssertions;

namespace api.Tests.Integration
{
    public class CartEndpointTests : IClassFixture<TestWebApplicationFactory>
    {
        private readonly TestWebApplicationFactory _factory;

        public CartEndpointTests(TestWebApplicationFactory factory)
        {
            _factory = factory;
        }

        [Fact]
        public async Task GetCart_With_Authenticated_User_Should_Return_Ok()
        {
            var client = _factory.CreateClient();

            var loginResponse = await client.PostAsJsonAsync("/api/auth/login", new
            {
                Email = "integration@test.com",
                Password = "Password1"
            });

            loginResponse.IsSuccessStatusCode.Should().BeTrue();

            var loginData = await loginResponse.Content.ReadFromJsonAsync<LoginResponse>();
            loginData.Should().NotBeNull();
            loginData!.Token.Should().NotBeNullOrWhiteSpace();

            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", loginData.Token);

            var response = await client.GetAsync("/api/cart");

            response.IsSuccessStatusCode.Should().BeTrue();
        }

        private class LoginResponse
        {
            public string Token { get; set; } = "";
            public string RefreshToken { get; set; } = "";
            public string Email { get; set; } = "";
            public string Role { get; set; } = "";
        }
    }
}