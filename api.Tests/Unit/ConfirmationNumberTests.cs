using api.Services;
using FluentAssertions;

namespace api.Tests.Unit
{
    public class ConfirmationNumberTests
    {
        [Fact]
        public void GenerateConfirmationNumber_Should_Start_With_ORD_Dash()
        {
            var confirmationNumber = OrderTestHelpers.GenerateConfirmationNumber();

            confirmationNumber.Should().StartWith("ORD-");
        }

        [Fact]
        public void GenerateConfirmationNumber_Should_Have_Expected_Length()
        {
            var confirmationNumber = OrderTestHelpers.GenerateConfirmationNumber();

            confirmationNumber.Length.Should().Be(14);
        }
    }
}