$(function() {
    localStorage.removeItem("level");
    $('.game-card').on('click', function(data) {
        localStorage.setItem("level", data["currentTarget"]["className"].split(" ")[1]);
    });
});