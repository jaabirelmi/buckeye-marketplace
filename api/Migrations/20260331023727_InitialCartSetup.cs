using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCartSetup : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Carts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UserId = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Carts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Title = table.Column<string>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: false),
                    Price = table.Column<decimal>(type: "TEXT", nullable: false),
                    Category = table.Column<string>(type: "TEXT", nullable: false),
                    SellerName = table.Column<string>(type: "TEXT", nullable: false),
                    PostedDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    ImageUrl = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CartItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    CartId = table.Column<int>(type: "INTEGER", nullable: false),
                    ProductId = table.Column<int>(type: "INTEGER", nullable: false),
                    Quantity = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CartItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CartItems_Carts_CartId",
                        column: x => x.CartId,
                        principalTable: "Carts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CartItems_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Id", "Category", "Description", "ImageUrl", "PostedDate", "Price", "SellerName", "Title" },
                values: new object[,]
                {
                    { 1, "Textbooks", "Used textbook in good condition.", "/images/textbook1.jpg", new DateTime(2026, 3, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), 35m, "William Murdoch", "CSE 3241 Textbook" },
                    { 2, "Electronics", "Works perfectly and fits most Dell laptops.", "/images/laptop1.jpg", new DateTime(2026, 3, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), 18m, "William Murdoch", "Laptop Charger" },
                    { 3, "School Supplies", "Barely used, clean and ready for lab.", "/images/goggles1.jpg", new DateTime(2026, 3, 3, 0, 0, 0, 0, DateTimeKind.Unspecified), 12m, "Maya Patel", "Biology Lab Goggles" },
                    { 4, "Textbooks", "Some highlighting but still in solid condition.", "/images/textbook2.jpg", new DateTime(2026, 3, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), 28m, "Maya Patel", "General Chemistry Textbook" },
                    { 5, "Furniture", "Works great, perfect for dorms or apartments.", "/images/fridge1.jpg", new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 80m, "Justin Westerling", "Mini Fridge" },
                    { 6, "Furniture", "Comfortable chair for studying or gaming.", "/images/chair1.jpg", new DateTime(2026, 2, 28, 0, 0, 0, 0, DateTimeKind.Unspecified), 45m, "Justin Westerling", "Desk Chair" },
                    { 7, "Electronics", "Small apartment microwave in good working condition.", "/images/microwave1.jpg", new DateTime(2026, 2, 27, 0, 0, 0, 0, DateTimeKind.Unspecified), 30m, "Justin Westerling", "Microwave" },
                    { 8, "School Supplies", "Five unused notebooks for classes.", "/images/notebooks1.jpg", new DateTime(2026, 2, 26, 0, 0, 0, 0, DateTimeKind.Unspecified), 8m, "Maya Patel", "Notebook Pack" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_CartItems_CartId",
                table: "CartItems",
                column: "CartId");

            migrationBuilder.CreateIndex(
                name: "IX_CartItems_ProductId",
                table: "CartItems",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_Carts_UserId",
                table: "Carts",
                column: "UserId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CartItems");

            migrationBuilder.DropTable(
                name: "Carts");

            migrationBuilder.DropTable(
                name: "Products");
        }
    }
}
