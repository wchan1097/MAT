$("#add").submit((event) => {
  event.preventDefault();
  var mediaElements = event.target.elements;
  var mediaType = mediaElements["type"].value;
  var media = {
    type: mediaType,
    title: mediaElements["title"].value,
    [(mediaType == "anime") ? "episode" : "chapter"] : mediaElements["currentIndex"].value,
    [(mediaType == "anime") ? "season" : "book"] : mediaElements["currentSeason"].value,
    language: mediaElements["lang"].value
  }
  $("#title").val("");
  $("#currentIndex").val(1);
  $("#currentSeason").val(1);
  $.get("/add", media, data => {
    console.log(data);
  })
})

function deleteManga(element){
  var id = element.parentNode.parentNode.id;
  var removeTitle = $(`#${id}`).find("h4").html();
  $.get("/remove", removeTitle, data => {
    console.log(data);
  });
  $(`#${id}`).remove();
}