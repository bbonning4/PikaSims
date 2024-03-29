// input field validation
var bounds = {
  level: [0, 100],
  base: [1, 255],
  evs: [0, 252],
  ivs: [0, 31],
  dvs: [0, 15],
  "move-bp": [0, 999],
};
for (var bounded in bounds) {
  if (bounds.hasOwnProperty(bounded)) {
    attachValidation(bounded, bounds[bounded][0], bounds[bounded][1]);
  }
}
function attachValidation(clazz, min, max) {
  $("." + clazz).keyup(function () {
    validate($(this), min, max);
  });
}
function validate(obj, min, max) {
  obj.val(Math.max(min, Math.min(max, ~~obj.val())));
}

// auto-calc stats and current HP on change
$(".level").keyup(function () {
  var poke = $(this).closest(".poke-info");
  calcHP(poke);
  calcStats(poke);
});

$(".max").bind("keyup change", function () {
  var poke = $(this).closest(".poke-info");
  calcHP(poke);
  calcStats(poke);
});
$(".nature").bind("keyup change", function () {
  calcStats($(this).closest(".poke-info"));
});
$(".hp .base, .hp .evs, .hp .ivs").bind("keyup change", function () {
  calcHP($(this).closest(".poke-info"));
});
$(".at .base, .at .evs, .at .ivs").bind("keyup change", function () {
  calcStat($(this).closest(".poke-info"), "at");
});
$(".df .base, .df .evs, .df .ivs").bind("keyup change", function () {
  calcStat($(this).closest(".poke-info"), "df");
});
$(".sa .base, .sa .evs, .sa .ivs").bind("keyup change", function () {
  calcStat($(this).closest(".poke-info"), "sa");
});
$(".sd .base, .sd .evs, .sd .ivs").bind("keyup change", function () {
  calcStat($(this).closest(".poke-info"), "sd");
});
$(".sp .base, .sp .evs, .sp .ivs").bind("keyup change", function () {
  calcStat($(this).closest(".poke-info"), "sp");
});
$(".evs").bind("keyup change", function () {
  calcEvTotal($(this).closest(".poke-info"));
});
$(".sl .base").keyup(function () {
  calcStat($(this).closest(".poke-info"), "sl");
});
$(".at .dvs").keyup(function () {
  var poke = $(this).closest(".poke-info");
  calcStat(poke, "at");
  poke.find(".hp .dvs").val(getHPDVs(poke));
  calcHP(poke);
});
$(".df .dvs").keyup(function () {
  var poke = $(this).closest(".poke-info");
  calcStat(poke, "df");
  poke.find(".hp .dvs").val(getHPDVs(poke));
  calcHP(poke);
});
$(".sa .dvs").keyup(function () {
  var poke = $(this).closest(".poke-info");
  calcStat(poke, "sa");
  poke.find(".sd .dvs").val($(this).val());
  calcStat(poke, "sd");
  poke.find(".hp .dvs").val(getHPDVs(poke));
  calcHP(poke);
});
$(".sp .dvs").keyup(function () {
  var poke = $(this).closest(".poke-info");
  calcStat(poke, "sp");
  poke.find(".hp .dvs").val(getHPDVs(poke));
  calcHP(poke);
});
$(".sl .dvs").keyup(function () {
  var poke = $(this).closest(".poke-info");
  calcStat(poke, "sl");
  poke.find(".hp .dvs").val(getHPDVs(poke));
  calcHP(poke);
});

function getHPDVs(poke) {
  return (
    (~~poke.find(".at .dvs").val() % 2) * 8 +
    (~~poke.find(".df .dvs").val() % 2) * 4 +
    (~~poke.find(gen === 1 ? ".sl .dvs" : ".sa .dvs").val() % 2) * 2 +
    (~~poke.find(".sp .dvs").val() % 2)
  );
}

function calcStats(poke) {
  for (var i = 0; i < STATS.length; i++) {
    calcStat(poke, STATS[i]);
  }
}

function calcEvTotal(poke) {
  var total = 0;
  poke.find(".evs").each(function (idx, elt) {
    total += 1 * $(elt).val();
  });

  var newClass = total > 510 ? "overLimit" : "underLimit";

  var left = 510 - total;

  var newClassLeft = left < 0 ? "overLimit" : "underLimit";

  var evTotal = poke.find(".ev-total");
  evTotal.removeClass("underLimit overLimit").text(total).addClass(newClass);

  var evLeft = poke.find(".ev-left");
  evLeft.removeClass("underLimit overLimit").text(left).addClass(newClassLeft);
}

function calcCurrentHP(poke, max, percent) {
  var current = Math.ceil((percent * max) / 100);
  poke.find(".current-hp").val(current);
}
function calcPercentHP(poke, max, current) {
  var percent = Math.floor((100 * current) / max);
  poke.find(".percent-hp").val(percent);
}
$(".current-hp").keyup(function () {
  var max = $(this).parent().children(".max-hp").text();
  validate($(this), 0, max);
  var current = $(this).val();
  calcPercentHP($(this).parent(), max, current);
});
$(".percent-hp").keyup(function () {
  var max = $(this).parent().children(".max-hp").text();
  validate($(this), 0, 100);
  var percent = $(this).val();
  calcCurrentHP($(this).parent(), max, percent);
});

var lastAura = [false, false, false];
$(".ability").bind("keyup change", function () {
  $(this)
    .closest(".poke-info")
    .find(".move-hits")
    .val($(this).val() === "Skill Link" ? 5 : 1);
  autoSetAura();
  autoSetTerrain();
});

$("#p1 .ability").bind("keyup change", function () {
  autosetWeather($(this).val(), 0);
});
$("#p2 .ability").bind("keyup change", function () {
  autosetWeather($(this).val(), 1);
});

var lastTerrain = "noterrain";
var lastManualWeather = "";
var lastAutoWeather = ["", ""];
function autoSetAura() {
  var ability1 = $("#p1 .ability").val();
  var ability2 = $("#p2 .ability").val();
  if (ability1 == "Fairy Aura" || ability2 == "Fairy Aura")
    $("input:checkbox[id='fairy-aura']").prop("checked", true);
  else $("input:checkbox[id='fairy-aura']").prop("checked", lastAura[0]);
  if (ability1 == "Dark Aura" || ability2 == "Dark Aura")
    $("input:checkbox[id='dark-aura']").prop("checked", true);
  else $("input:checkbox[id='dark-aura']").prop("checked", lastAura[1]);
  if (ability1 == "Aura Break" || ability2 == "Aura Break")
    $("input:checkbox[id='aura-break']").prop("checked", true);
  else $("input:checkbox[id='aura-break']").prop("checked", lastAura[2]);
}
function autoSetTerrain() {
  var ability1 = $("#p1 .ability").val();
  var ability2 = $("#p2 .ability").val();
  if (ability1 == "Electric Surge" || ability2 == "Electric Surge") {
    $("input:radio[id='electric']").prop("checked", true);
    lastTerrain = "electric";
  } else if (ability1 == "Grassy Surge" || ability2 == "Grassy Surge") {
    $("input:radio[id='grassy']").prop("checked", true);
    lastTerrain = "grassy";
  } else if (ability1 == "Misty Surge" || ability2 == "Misty Surge") {
    $("input:radio[id='misty']").prop("checked", true);
    lastTerrain = "misty";
  } else if (ability1 == "Psychic Surge" || ability2 == "Psychic Surge") {
    $("input:radio[id='psychic']").prop("checked", true);
    lastTerrain = "psychic";
  } else $("input:radio[id='noterrain']").prop("checked", true);
}

function autosetWeather(ability, i) {
  var currentWeather = $("input:radio[name='weather']:checked").val();
  if (lastAutoWeather.indexOf(currentWeather) === -1 || currentWeather === "") {
    lastManualWeather = currentWeather;
    lastAutoWeather[1 - i] = "";
  }

  var primalWeather = ["Harsh Sunshine", "Heavy Rain"];
  var autoWeatherAbilities = {
    Drought: "Sun",
    Drizzle: "Rain",
    "Sand Stream": "Sand",
    "Snow Warning": "Snow",
    "Desolate Land": "Harsh Sunshine",
    "Primordial Sea": "Heavy Rain",
    "Delta Stream": "Strong Winds",
  };
  var newWeather;

  if (ability in autoWeatherAbilities) {
    lastAutoWeather[i] = autoWeatherAbilities[ability];
    if (currentWeather === "Strong Winds") {
      if (lastAutoWeather.indexOf("Strong Winds") === -1) {
        newWeather = lastAutoWeather[i];
      }
    } else if (primalWeather.indexOf(currentWeather) > -1) {
      if (
        lastAutoWeather[i] === "Strong Winds" ||
        primalWeather.indexOf(lastAutoWeather[i]) > -1
      ) {
        newWeather = lastAutoWeather[i];
      } else if (primalWeather.indexOf(lastAutoWeather[1 - i]) > -1) {
        newWeather = lastAutoWeather[1 - i];
      } else {
        newWeather = lastAutoWeather[i];
      }
    } else {
      newWeather = lastAutoWeather[i];
    }
  } else {
    lastAutoWeather[i] = "";
    newWeather =
      lastAutoWeather[1 - i] !== ""
        ? lastAutoWeather[1 - i]
        : lastManualWeather;
  }

  if (newWeather === "Strong Winds" || primalWeather.indexOf(newWeather) > -1) {
    //$("input:radio[name='weather']").prop("disabled", true);
    //edited out by squirrelboy1225 for doubles!
    $("input:radio[name='weather'][value='" + newWeather + "']").prop(
      "disabled",
      false
    );
  } else if (typeof newWeather != "undefined") {
    for (var k = 0; k < $("input:radio[name='weather']").length; k++) {
      var val = $("input:radio[name='weather']")[k].value;
      if (primalWeather.indexOf(val) === -1 && val !== "Strong Winds") {
        $("input:radio[name='weather']")[k].disabled = false;
      } else {
        //$("input:radio[name='weather']")[k].disabled = true;
        //edited out by squirrelboy1225 for doubles!
      }
    }
  }
  $("input:radio[name='weather'][value='" + newWeather + "']").prop(
    "checked",
    true
  );
}

$("#p1 .item").bind("keyup change", function () {
  autosetStatus("#p1", $(this).val());
  autosetWeaknessPolicy("#p1", $(this).val());
});
$("#p2 .item").bind("keyup change", function () {
  autosetStatus("#p2", $(this).val());
  autosetWeaknessPolicy("#p2", $(this).val());
});

function autosetWeaknessPolicy(p, item) {
  if (item == "Weakness Policy") {
    $(p).find(".sa .boost").val("2");
    $(p).find(".at .boost").val("2");
  }
}

var lastManualStatus = { "#p1": "Healthy", "#p2": "Healthy" };
var lastAutoStatus = { "#p1": "Healthy", "#p2": "Healthy" };
function autosetStatus(p, item) {
  var currentStatus = $(p + " .status").val();
  if (currentStatus !== lastAutoStatus[p]) {
    lastManualStatus[p] = currentStatus;
  }
  if (item === "Flame Orb") {
    lastAutoStatus[p] = "Burned";
    $(p + " .status").val("Burned");
    $(p + " .status").change();
  } else if (item === "Toxic Orb") {
    lastAutoStatus[p] = "Badly Poisoned";
    $(p + " .status").val("Badly Poisoned");
    $(p + " .status").change();
  } else {
    lastAutoStatus[p] = "Healthy";
    if (currentStatus !== lastManualStatus[p]) {
      $(p + " .status").val(lastManualStatus[p]);
      $(p + " .status").change();
    }
  }
}

$(".status").bind("keyup change", function () {
  if ($(this).val() === "Badly Poisoned") {
    $(this).parent().children(".toxic-counter").show();
  } else {
    $(this).parent().children(".toxic-counter").hide();
  }
});

// auto-update move details on select
$(".move-selector").change(function () {
  var moveName = $(this).val();
  var move = moves[moveName] || moves["(No Move)"];
  var moveGroupObj = $(this).parent();
  moveGroupObj.children(".move-bp").val(move.bp);
  moveGroupObj.children(".move-type").val(move.type);
  moveGroupObj.children(".move-cat").val(move.category);
  moveGroupObj.children(".move-crit").prop("checked", move.alwaysCrit === true);
  if (move.isMultiHit) {
    moveGroupObj.children(".move-hits").show();
    moveGroupObj
      .children(".move-hits")
      .val(
        $(this).closest(".poke-info").find(".ability").val() === "Skill Link"
          ? 5
          : 1
      );
  } else {
    moveGroupObj.children(".move-hits").hide();
  }
  moveGroupObj.children(".move-z").prop("checked", false);
});

// auto-update set details on select
$(".set-selector").change(function () {
  var fullSetName = $(this).val();
  var pokemonName, setName;
  var DOU = !$("#douswitch").is(":checked");
  pokemonName = fullSetName.substring(0, fullSetName.indexOf(" ("));
  setName = fullSetName.substring(
    fullSetName.indexOf("(") + 1,
    fullSetName.lastIndexOf(")")
  );
  var pokemon = pokedex[pokemonName];
  if (pokemon) {
    var pokeObj = $(this).closest(".poke-info");

    // If the sticky move was on this side, reset it
    if (stickyMoves.getSelectedSide() === pokeObj.prop("id")) {
      stickyMoves.clearStickyMove();
    }

    pokeObj.find(".type1").val(pokemon.t1);
    pokeObj.find(".type2").val(pokemon.t2);

    if (pokemon.teraType != "") pokeObj.find(".teraType").val(pokemon.teraType);

    pokeObj.find(".hp .base").val(pokemon.bs.hp);
    var i;
    for (i = 0; i < STATS.length; i++) {
      pokeObj.find("." + STATS[i] + " .base").val(pokemon.bs[STATS[i]]);
    }
    pokeObj.find(".weight").val(pokemon.w);
    pokeObj.find(".boost").val(0);
    pokeObj.find(".percent-hp").val(100);
    pokeObj.find(".status").val("Healthy");
    $(".status").change();
    var moveObj;
    var abilityObj = pokeObj.find(".ability");
    var itemObj = pokeObj.find(".item");
    if (pokemonName in setdex && setName in setdex[pokemonName]) {
      var set = setdex[pokemonName][setName];
      if (DOU) pokeObj.find(".level").val(100);
      else pokeObj.find(".level").val(set.level);
      pokeObj
        .find(".hp .evs")
        .val(set.evs && typeof set.evs.hp !== "undefined" ? set.evs.hp : 0);
      pokeObj
        .find(".hp .ivs")
        .val(set.ivs && typeof set.ivs.hp !== "undefined" ? set.ivs.hp : 31);
      pokeObj
        .find(".hp .dvs")
        .val(set.dvs && typeof set.dvs.hp !== "undefined" ? set.dvs.hp : 15);
      for (i = 0; i < STATS.length; i++) {
        pokeObj
          .find("." + STATS[i] + " .evs")
          .val(
            set.evs && typeof set.evs[STATS[i]] !== "undefined"
              ? set.evs[STATS[i]]
              : 0
          );
        pokeObj
          .find("." + STATS[i] + " .ivs")
          .val(
            set.ivs && typeof set.ivs[STATS[i]] !== "undefined"
              ? set.ivs[STATS[i]]
              : 31
          );
        pokeObj
          .find("." + STATS[i] + " .dvs")
          .val(
            set.dvs && typeof set.dvs[STATS[i]] !== "undefined"
              ? set.dvs[STATS[i]]
              : 15
          );
      }
      setSelectValueIfValid(pokeObj.find(".nature"), set.nature, "Hardy");
      setSelectValueIfValid(abilityObj, set.ability || pokemon.ab, "");
      setSelectValueIfValid(itemObj, set.item, "");
      for (i = 0; i < 4; i++) {
        moveObj = pokeObj.find(".move" + (i + 1) + " select.move-selector");
        setSelectValueIfValid(moveObj, set.moves[i], "(No Move)");
        moveObj.change();
      }
    } else {
      if (DOU) pokeObj.find(".level").val(100);
      else pokeObj.find(".level").val(50);
      pokeObj.find(".hp .evs").val(0);
      pokeObj.find(".hp .ivs").val(31);
      pokeObj.find(".hp .dvs").val(15);
      for (i = 0; i < STATS.length; i++) {
        pokeObj.find("." + STATS[i] + " .evs").val(0);
        pokeObj.find("." + STATS[i] + " .ivs").val(31);
        pokeObj.find("." + STATS[i] + " .dvs").val(15);
      }
      pokeObj.find(".nature").val("Hardy");
      setSelectValueIfValid(abilityObj, pokemon.ab, "");
      itemObj.val("");
      for (i = 0; i < 4; i++) {
        moveObj = pokeObj.find(".move" + (i + 1) + " select.move-selector");
        moveObj.val("(No Move)");
        moveObj.change();
      }
    }
    var formeObj = $(this).siblings().find(".forme").parent();
    itemObj.prop("disabled", false);
    if (pokemon.formes) {
      showFormes(formeObj, setName, pokemonName, pokemon);
    } else {
      formeObj.hide();
    }
    calcHP(pokeObj);
    calcStats(pokeObj);
    calcEvTotal(pokeObj);
    abilityObj.change();
    itemObj.change();
  }
});

function showFormes(formeObj, setName, pokemonName, pokemon) {
  var defaultForme = 0;

  if (setName !== "Blank Set") {
    var set = setdex[pokemonName][setName];

    // Repurpose the previous filtering code to provide the "different default" logic
    if (
      (set.item.indexOf("ite") !== -1 && set.item.indexOf("ite Y") === -1) ||
      // (pokemonName === 'Groudon' && set.item.indexOf('Red Orb') !== -1) ||
      // (pokemonName === 'Kyogre' && set.item.indexOf('Blue Orb') !== -1) ||
      (pokemonName === "Meloetta" && set.moves.indexOf("Relic Song") !== -1)
      // (pokemonName === 'Rayquaza' &&
      // set.moves.indexOf('Dragon Ascent') !== -1)
    ) {
      defaultForme = 1;
    } else if (set.item.indexOf("ite Y") !== -1) {
      defaultForme = 2;
    }
  }

  var formeOptions = getSelectOptions(pokemon.formes, false, defaultForme);
  formeObj
    .children("select")
    .find("option")
    .remove()
    .end()
    .append(formeOptions)
    .change();
  formeObj.show();
}

function setSelectValueIfValid(select, value, fallback) {
  select.val(
    select.children('option[value="' + value + '"]').length !== 0
      ? value
      : fallback
  );
}

$(".forme").change(function () {
  var altForme = pokedex[$(this).val()],
    container = $(this).closest(".info-group").siblings(),
    fullSetName = container.find(".select2-chosen").first().text(),
    pokemonName = fullSetName.substring(0, fullSetName.indexOf(" (")),
    setName = fullSetName.substring(
      fullSetName.indexOf("(") + 1,
      fullSetName.lastIndexOf(")")
    );

  $(this).parent().siblings().find(".type1").val(altForme.t1);
  $(this)
    .parent()
    .siblings()
    .find(".type2")
    .val(typeof altForme.t2 != "undefined" ? altForme.t2 : "");
  $(this).parent().siblings().find(".weight").val(altForme.w);
  var STATS_WITH_HP = ["hp", "at", "df", "sa", "sd", "sp"];
  for (var i = 0; i < STATS_WITH_HP.length; i++) {
    var baseStat = container.find("." + STATS_WITH_HP[i]).find(".base");
    baseStat.val(altForme.bs[STATS_WITH_HP[i]]);
    baseStat.keyup();
  }

  try {
    if (abilities.indexOf(altForme.ab) > -1) {
      container.find(".ability").val(altForme.ab);
    } else if (
      setName !== "Blank Set" &&
      abilities.indexOf(setdex[pokemonName][setName].ability) > -1
    ) {
      container.find(".ability").val(setdex[pokemonName][setName].ability);
    } else {
      container.find(".ability").val("");
    }
    container.find(".ability").keyup();
  } catch (e) {}

  if (
    $(this).val().indexOf("Mega") === 0 &&
    $(this).val() !== "Mega Rayquaza"
  ) {
    container.find(".item").val("").keyup();
    //container.find(".item").prop("disabled", true);
    //edited out by squirrelboy1225 for doubles!
  } else {
    container.find(".item").prop("disabled", false);
  }

  if (pokemonName === "Darmanitan") {
    container
      .find(".percent-hp")
      .val($(this).val() === "Darmanitan-Z" ? "50" : "100")
      .keyup();
  }
});

function getTerrainEffects() {
  var className = $(this).prop("className");
  className = className.substring(0, className.indexOf(" "));
  switch (className) {
    case "type1":
    case "type2":
    case "ability":
    case "item":
      var id = $(this).closest(".poke-info").prop("id");
      var terrainValue = $("input:checkbox[name='terrain']:checked").val();
      if (terrainValue === "Electric") {
        $("#" + id)
          .find("[value='Asleep']")
          .prop("disabled", isGrounded($("#" + id)));
      } else if (terrainValue === "Misty") {
        $("#" + id)
          .find(".status")
          .prop("disabled", isGrounded($("#" + id)));
      }
      break;
    default:
      $("input:checkbox[name='terrain']").not(this).prop("checked", false);
      if ($(this).prop("checked") && $(this).val() === "Electric") {
        $("#p1")
          .find("[value='Asleep']")
          .prop("disabled", isGrounded($("#p1")));
        $("#p2")
          .find("[value='Asleep']")
          .prop("disabled", isGrounded($("#p2")));
      } else if ($(this).prop("checked") && $(this).val() === "Misty") {
        $("#p1")
          .find(".status")
          .prop("disabled", isGrounded($("#p1")));
        $("#p2")
          .find(".status")
          .prop("disabled", isGrounded($("#p2")));
      } else {
        $("#p1").find("[value='Asleep']").prop("disabled", false);
        $("#p1").find(".status").prop("disabled", false);
        $("#p2").find("[value='Asleep']").prop("disabled", false);
        $("#p2").find(".status").prop("disabled", false);
      }
      break;
  }
}

function isGrounded(pokeInfo) {
  var teraType = pokeInfo.find(".teraToggle").is(":checked")
    ? pokeInfo.find(".teraType").val()
    : undefined;
  return (
    $("#gravity").prop("checked") ||
    (teraType
      ? teraType !== "Flying"
      : pokeInfo.find(".type1").val() !== "Flying" && teraType
      ? teraType !== "Flying"
      : pokeInfo.find(".type2").val() !== "Flying" &&
        pokeInfo.find(".ability").val() !== "Levitate" &&
        pokeInfo.find(".item").val() !== "Air Balloon")
  );
}

var resultLocations = [[], []];
for (var i = 0; i < 4; i++) {
  resultLocations[0].push({
    move: "#resultMoveL" + (i + 1),
    damage: "#resultDamageL" + (i + 1),
  });
  resultLocations[1].push({
    move: "#resultMoveR" + (i + 1),
    damage: "#resultDamageR" + (i + 1),
  });
}

var damageResults;
function calculateAll(rerender_surv_dd = true) {
  var field = new Field();
  var p1 = new Pokemon($("#p1"), field);
  var p2 = new Pokemon($("#p2"), field);
  damageResults = calculateAllMoves(p1, p2, field);
  var result,
    minDamage,
    maxDamage,
    minPercent,
    maxPercent,
    percentText,
    notation;
  notation = "%";
  var highestMaxPercent = -1;
  var bestResult;
  for (var i = 0; i < 4; i++) {
    result = damageResults[0][i];
    minDamage = result.damage[0] * p1.moves[i].hits;
    maxDamage = result.damage[result.damage.length - 1] * p1.moves[i].hits;
    minPercent = Math.floor((minDamage * 1000) / p2.maxHP) / 10;
    maxPercent = Math.floor((maxDamage * 1000) / p2.maxHP) / 10;
    result.damageText =
      minDamage +
      ' <span style="color:' +
      colorPercent(minPercent) +
      ';">(' +
      minPercent +
      notation +
      ")</span>" +
      " - " +
      maxDamage +
      ' <span style="color:' +
      colorPercent(maxPercent) +
      ';">(' +
      maxPercent +
      notation +
      ")</span>";
    result.koChanceText =
      p1.moves[i].bp === 0
        ? ""
        : getKOChanceText(
            result.damage,
            p1.moves[i],
            p2,
            field.getSide(1),
            p1.ability === "Bad Dreams"
          );
    $(resultLocations[0][i].move + " + label").text(
      p1.moves[i].displayName.replace("Hidden Power", "HP")
    );
    $(resultLocations[0][i].damage).html(
      '<span style="color:' +
        colorPercent(minPercent) +
        ';">' +
        minPercent +
        notation +
        '</span> - <span style="color:' +
        colorPercent(maxPercent) +
        ';">' +
        maxPercent +
        notation +
        "</span>"
    );
    if (maxPercent > highestMaxPercent) {
      highestMaxPercent = maxPercent;
      bestResult = $(resultLocations[0][i].move);
    }

    result = damageResults[1][i];
    minDamage = result.damage[0] * p2.moves[i].hits;
    maxDamage = result.damage[result.damage.length - 1] * p2.moves[i].hits;
    minPercent = Math.floor((minDamage * 1000) / p1.maxHP) / 10;
    maxPercent = Math.floor((maxDamage * 1000) / p1.maxHP) / 10;
    result.damageText =
      minDamage +
      ' <span style="color:' +
      colorPercent(minPercent) +
      ';">(' +
      minPercent +
      notation +
      ")</span>" +
      " - " +
      maxDamage +
      ' <span style="color:' +
      colorPercent(maxPercent) +
      ';">(' +
      maxPercent +
      notation +
      ")</span>";
    result.koChanceText =
      p2.moves[i].bp === 0
        ? ""
        : getKOChanceText(
            result.damage,
            p2.moves[i],
            p1,
            field.getSide(0),
            p2.ability === "Bad Dreams"
          );
    $(resultLocations[1][i].move + " + label").text(
      p2.moves[i].displayName.replace("Hidden Power", "HP")
    );
    $(resultLocations[1][i].damage).html(
      '<span style="color:' +
        colorPercent(minPercent) +
        ';">' +
        minPercent +
        notation +
        '</span> - <span style="color:' +
        colorPercent(maxPercent) +
        ';">' +
        maxPercent +
        notation +
        "</span>"
    );
    if (maxPercent > highestMaxPercent) {
      highestMaxPercent = maxPercent;
      bestResult = $(resultLocations[1][i].move);
    }
  }
  if ($(".locked-move").length) {
    bestResult = $(".locked-move");
  } else {
    stickyMoves.setSelectedMove(bestResult.prop("id"));
  }
  bestResult.prop("checked", true);
  bestResult.change();
  $("#resultHeaderL").text(
    p1.name + "'s Moves (select one to show detailed results)"
  );
  $("#resultHeaderR").text(
    p2.name + "'s Moves (select one to show detailed results)"
  );
  if (p1.name.indexOf("-Gmax") > -1) {
    $("label[for='maxL']").text("Gigantamax");
  } else {
    $("label[for='maxL']").text("Dynamax");
  }
  if (p2.name.indexOf("-Gmax") > -1) {
    $("label[for='maxR']").text("Gigantamax");
  } else {
    $("label[for='maxR']").text("Dynamax");
  }

  renderSpeedCalcs(p1, p2);

  renderSurvCalcPanel(p1, p2, rerender_surv_dd);

  var calcLink = updateCalcLink([1, 2]);
  $("#calc-link").val(calcLink);
}

function renderSpeedCalcs(p1, p2) {
  $("#p1_speed_calc").text(p1.stats.sp);
  $("#p2_speed_calc").text(p2.stats.sp);
}

function renderSurvCalcPanel(p1, p2, rerender_surv_dd) {
  $("#surv_calc_button").show();
  $("#surv_button_loader").hide();
  $("#surv_calc_title").html(`
        <div>
            <span class="sprite-xyicons ${p1.name.toLowerCase()}" style="display:inline-block;vertical-align:middle;"></span>
            Survival EV Minimizer
            <span class="sprite-xyicons ${p2.name.toLowerCase()}" style="display:inline-block;vertical-align:middle;"></span>
        </div>
    `);

  if (rerender_surv_dd) {
    $("#surv_calc_dd").html(`<select id="surv_calc_select"></select>`);
    for (let i in p2.moves) {
      const move = p2.moves[i];
      if (move.name == "(No Move)" || move.name == undefined || move.name == "")
        continue;
      $("#surv_calc_select").append(`<option>${move.name}</option>`);
    }
  }

  if (p1.name + p2.name != this.lastSurv) {
    $("#surv_calc_results").html(``);
  }

  $("#surv_calc_you").text(`${p1.name}'s`);
  $("#surv_calc_opp").text(`${p2.name}'s`);
}

function survCalcButton() {
  $("#surv_calc_button").hide();
  $("#surv_button_loader").show();

  $("#surv_calc_results").html(``);
  setTimeout(() => {
    const field = new Field();
    const p1 = new Pokemon($("#p1"), field);
    const p2 = new Pokemon($("#p2"), field);

    this.lastSurv = p1.name + p2.name;

    const hpRem = 100 - ($("#surv_calc_perc").val() || 0);
    let move = $("#surv_calc_select").val() || null;
    const forceEV = {};
    if ($("#surv_def_fixed").val() > 0)
      forceEV.def = $("#surv_def_fixed").val();
    if ($("#surv_hp_fixed").val() > 0) forceEV.hp = $("#surv_hp_fixed").val();
    if ($("#surv_spd_fixed").val() > 0)
      forceEV.spd = $("#surv_spd_fixed").val();
    const result = survCalc(p1, p2, field, hpRem, move, forceEV);

    $("#surv_button_loader").hide();
    $("#surv_calc_button").show();

    for (let i in result) {
      if (result[i] == undefined) {
        $("#surv_calc_results").append(`
                <div style="line-height:20px;white-space: nowrap;overflow: auto;font-size:11px;margin-top:10px;margin-bottom:6px;background:rgba(0,0,0,0.05);border-radius:4px;padding:10px;">${i} vs. ${
          p1.name
        } survive with >= ${$(
          "#surv_calc_perc"
        ).val()}% HP:<br>&nbsp;&nbsp;&nbsp;&nbsp;Impossible</div>
                `);
        continue;
      }
      const survRes = result[i];
      let closestTry = false;
      if (100 - survRes.per * 100 < $("#surv_calc_perc").val() || 0) {
        closestTry = true;
      }
      const noInvest =
        survRes.hp == 0 && (survRes.def == 0 || survRes.spd == 0);
      let isPhys = survRes.def != undefined;
      let offEV = p2.evs[isPhys == true ? "at" : "sa"];
      let offEVTitle = isPhys == true ? "Atk" : "SpA";
      let resultString = `<div style="line-height:20px;white-space: nowrap;overflow: auto;font-size:11px;margin-top:10px;margin-bottom:6px;background:rgba(0,0,0,0.05);border-radius:4px;padding:10px;">${offEV} ${offEVTitle} ${i} vs. <b>${survRes.hp} HP / `;
      if (survRes.def != undefined) {
        resultString += `${survRes.def} Def</b> ${p1.name}:<br>`;
      } else {
        resultString += `${survRes.spd} SpD</b> ${p1.name}:<br>`;
      }
      resultString += `&nbsp;&nbsp;&nbsp;&nbsp;<b>${survRes.min}-${
        survRes.max
      }</b> (${(survRes.per * 100).toFixed(
        2
      )}%) - <span style="font-weight:bold;color:${
        closestTry == true ? "red" : "green"
      };">${(100 - (survRes.per * 100).toFixed(2)).toFixed(2)}% HP remaining${
        noInvest == true ? " without investment" : ""
      }</span></div>`;
      $("#surv_calc_results").append(resultString);
    }
  }, 100);
}

function getPokemonExportSet(pokemon) {
  var set = {
    name: pokemon.name,
    set: {
      ability: pokemon.ability,
      evs: {
        at: pokemon.evs.at,
        df: pokemon.evs.df,
        hp: pokemon.evs.hp,
        sa: pokemon.evs.sa,
        sd: pokemon.evs.sd,
        sp: pokemon.evs.sp,
      },
      item: pokemon.item,
      level: pokemon.level,
      moves: [],
      ivs: {
        atk: pokemon.ivs.at,
        def: pokemon.ivs.df,
        hp: pokemon.ivs.hp,
        spa: pokemon.ivs.sa,
        spd: pokemon.ivs.sd,
        spe: pokemon.ivs.sp,
      },
      nature: pokemon.nature,
    },
  };
  for (let i in pokemon.moves) {
    if (pokemon.moves[i].name == "(No Move)") continue;
    set.set.moves.push(pokemon.moves[i].name);
  }
  return set;
}

function updateCalcLink(playerNums) {
  var url = window.location.origin + window.location.pathname;
  for (let i in playerNums) {
    var playerNum = playerNums[i];
    var pokemon = new Pokemon($("#p" + playerNum));
    url += url.indexOf("?") > -1 ? "&" : "?";
    if (playerNum == 1) {
      url += "attSet=";
    } else {
      url += "defSet=";
    }
    set = getPokemonExportSet(pokemon);

    url += window.encodeURI(window.btoa(JSON.stringify(set)));
  }

  return url;
}

function exportPokemonLink(playerNums) {
  var url = updateCalcLink(playerNums);

  // Create an auxiliary hidden input
  var aux = document.createElement("input");

  // Get the text from the element passed into the input
  aux.setAttribute("value", url);

  // Append the aux input to the body
  document.body.appendChild(aux);

  // Highlight the content
  aux.select();

  // Execute the copy command
  document.execCommand("copy");

  // Remove the input from the body
  document.body.removeChild(aux);

  $("#link_copied_text").css("opacity", 1);
  setTimeout(() => {
    $("#link_copied_text").css("opacity", 0);
  }, 2000);
}

function exportPokemon(playerNum) {
  var pokemon = new Pokemon($("#p" + playerNum));
  let set = "";
  set += pokemon.name;
  if (pokemon.item != "") set += " @ " + pokemon.item + "\n";
  else set += "\n";
  if (pokemon.ability != "") set += "Ability: " + pokemon.ability + "\n";
  if (pokemon.level != "") set += "Level: " + pokemon.level + "\n";
  if (pokemon.name.indexOf("-Gmax") > -1) set += "Gigantamax: Yes\n";
  set +=
    "EVs: " +
    pokemon.evs.hp +
    " HP / " +
    pokemon.evs.at +
    " Atk / " +
    pokemon.evs.df +
    " Def / " +
    pokemon.evs.sa +
    " SpA / " +
    pokemon.evs.sd +
    " SpD / " +
    pokemon.evs.sp +
    " Spe\n";
  set += pokemon.nature + " Nature\n";
  set +=
    "IVs: " +
    pokemon.ivs.hp +
    " HP / " +
    pokemon.ivs.at +
    " Atk / " +
    pokemon.ivs.df +
    " Def / " +
    pokemon.ivs.sa +
    " SpA / " +
    pokemon.ivs.sd +
    " SpD / " +
    pokemon.ivs.sp +
    " Spe\n";
  for (let i in pokemon.moves) {
    if (pokemon.moves[i].name == "(No Move)") continue;
    set += "- " + pokemon.moves[i].name + "\n";
  }
  $("#customMon").val("");
  $("#customMon").val(set);
}

function colorPercent(number) {
  var color;

  if (number < 40) color = "darkred";
  if (40 <= number && number <= 60) color = "#7d7600";
  if (number > 60) color = "darkgreen";

  return color;
}

$(".result-move").change(function () {
  if (damageResults) {
    var result = findDamageResult($(this));
    if (result) {
      $("#mainResult").html(result.description.msg);
      if (result.parentDamage) {
        $("#damageValues").text(
          "(First hit: " +
            result.parentDamage.join(", ") +
            "; Second hit: " +
            result.childDamage.join(", ") +
            ")"
        );
      } else {
        $("#damageValues").text("(" + result.damage.join(", ") + ")");
      }
    }
  }
});

// Need to close over "lastClicked", so we'll do it the old-fashioned way to avoid
// needlessly polluting the global namespace.
var stickyMoves = (function () {
  var lastClicked = "resultMoveL1";
  $(".result-move").click(function () {
    if (this.id === lastClicked) {
      $(this).toggleClass("locked-move");
    } else {
      $(".locked-move").removeClass("locked-move");
    }
    lastClicked = this.id;
  });

  return {
    clearStickyMove: function () {
      lastClicked = null;
      $(".locked-move").removeClass("locked-move");
    },
    setSelectedMove: function (slot) {
      lastClicked = slot;
    },
    getSelectedSide: function () {
      if (lastClicked) {
        if (lastClicked.indexOf("resultMoveL") !== -1) {
          return "p1";
        } else if (lastClicked.indexOf("resultMoveR") !== -1) {
          return "p2";
        }
      }
      return null;
    },
  };
})();

function findDamageResult(resultMoveObj) {
  var selector = "#" + resultMoveObj.attr("id");
  for (var i = 0; i < resultLocations.length; i++) {
    for (var j = 0; j < resultLocations[i].length; j++) {
      if (resultLocations[i][j].move === selector) {
        return damageResults[i][j];
      }
    }
  }
}

function Pokemon(pokeInfo, field) {
  var setName = pokeInfo.find("input.set-selector").val();
  if (setName.indexOf("(") === -1) {
    this.name = setName;
  } else {
    var pokemonName = setName.substring(0, setName.indexOf(" ("));
    this.name = pokedex[pokemonName].formes
      ? pokeInfo.find(".forme").val()
      : pokemonName;
  }
  var teraType = pokeInfo.find(".teraType").val();
  var teraTypeEnabled = pokeInfo.find(".teraToggle").prop("checked");
  if (teraTypeEnabled && teraType != "") this.teraType = teraType;
  this.type1 = pokeInfo.find(".type1").val();
  this.type2 = pokeInfo.find(".type2").val();
  this.level = ~~pokeInfo.find(".level").val();
  this.maxHP = ~~pokeInfo.find(".hp .total").text();
  this.curHP = ~~pokeInfo.find(".current-hp").val();
  this.HPEVs = ~~pokeInfo.find(".hp .evs").val();
  this.isDynamax = pokeInfo.find(".max").prop("checked");
  this.rawStats = {};
  this.baseStats = {};
  this.boosts = {};
  this.stats = {};
  this.evs = {};
  this.ivs = {};
  for (var i = 0; i < STATS.length; i++) {
    this.rawStats[STATS[i]] = ~~pokeInfo
      .find("." + STATS[i] + " .total")
      .text();
    this.boosts[STATS[i]] = ~~pokeInfo.find("." + STATS[i] + " .boost").val();
    this.baseStats[STATS[i]] = ~~pokeInfo.find("." + STATS[i] + " .base").val();
    this.evs[STATS[i]] = ~~pokeInfo.find("." + STATS[i] + " .evs").val();
    this.ivs[STATS[i]] = ~~pokeInfo.find("." + STATS[i] + " .ivs").val();
  }
  this.evs.hp = ~~pokeInfo.find(".hp .evs").val();
  this.ivs.hp = ~~pokeInfo.find(".hp .ivs").val();
  this.nature = pokeInfo.find(".nature").val();
  this.ability = pokeInfo.find(".ability").val();
  this.item = pokeInfo.find(".item").val();
  this.status = pokeInfo.find(".status").val();
  this.toxicCounter =
    this.status === "Badly Poisoned"
      ? ~~pokeInfo.find(".toxic-counter").val()
      : 0;
  this.moves = [
    getMoveDetails(
      pokeInfo,
      pokeInfo.find(".move1"),
      pokeInfo.find(".max").prop("checked"),
      this.name,
      field
    ),
    getMoveDetails(
      pokeInfo,
      pokeInfo.find(".move2"),
      pokeInfo.find(".max").prop("checked"),
      this.name,
      field
    ),
    getMoveDetails(
      pokeInfo,
      pokeInfo.find(".move3"),
      pokeInfo.find(".max").prop("checked"),
      this.name,
      field
    ),
    getMoveDetails(
      pokeInfo,
      pokeInfo.find(".move4"),
      pokeInfo.find(".max").prop("checked"),
      this.name,
      field
    ),
  ];
  this.weight = +pokeInfo.find(".weight").val();
}

// field is undefined when exporting a Pokemon, that's fine, it's for UI purposes
function getMoveDetails(pokeInfo, moveInfo, isMax, species, field) {
  var moveName = moveInfo.find("select.move-selector").val();
  var defaultDetails = moves[moveName];

  var move = $.extend({}, defaultDetails, {
    name: moveName,
    displayName: moveName,
    species: species,
    bp: ~~moveInfo.find(".move-bp").val(),
    type: moveInfo.find(".move-type").val(),
    category: moveInfo.find(".move-cat").val(),
    isCrit: moveInfo.find(".move-crit").prop("checked"),
    isZ: moveInfo.find(".move-z").prop("checked"),
    isMax: isMax,
    useMax: isMax,

    hits:
      defaultDetails.isMultiHit && !moveInfo.find(".move-z").prop("checked")
        ? ~~moveInfo.find(".move-hits").val()
        : defaultDetails.isTwoHit &&
          !moveInfo.find(".move-z").prop("checked") &&
          !isMax
        ? 2
        : 1,
  });

  var gen9 = calc.Generations.get(9);
  var calcMove = new calc.Move(gen9, move.name, move);
  if (calcMove != null) move.displayName = calcMove.name;

  // UI update checks to happen after blocking JS
  checkMoveUICases(moveName, moveInfo, pokeInfo, field);

  return move;
}

function Field() {
  var format = $("input:radio[name='format']:checked").val();
  var isGravity = $("#gravity").prop("checked");
  var isAuraBreak = $("#aura-break").prop("checked");
  var isFairyAura = $("#fairy-aura").prop("checked");
  var isDarkAura = $("#dark-aura").prop("checked");
  var isSR = [$("#srL").prop("checked"), $("#srR").prop("checked")];
  var isProtect = [
    $("#protectL").prop("checked"),
    $("#protectR").prop("checked"),
  ];
  var weather;
  var spikes;
  if (gen === 2) {
    spikes = [
      $("#gscSpikesL").prop("checked") ? 1 : 0,
      $("#gscSpikesR").prop("checked") ? 1 : 0,
    ];
    weather = $("input:radio[name='gscWeather']:checked").val();
  } else {
    weather = $("input:radio[name='weather']:checked").val();
    spikes = [
      ~~$("input:radio[name='spikesL']:checked").val(),
      ~~$("input:radio[name='spikesR']:checked").val(),
    ];
  }
  var terrain = $("input:radio[name='terrain']:checked").val()
    ? $("input:radio[name='terrain']:checked").val()
    : "";
  var isReflect = [
    $("#reflectL").prop("checked"),
    $("#reflectR").prop("checked"),
  ];
  var isLightScreen = [
    $("#lightScreenL").prop("checked"),
    $("#lightScreenR").prop("checked"),
  ];
  var isAuroraVeil = [
    $("#auroraVeilL").prop("checked"),
    $("#auroraVeilR").prop("checked"),
  ];
  var isForesight = [
    $("#foresightL").prop("checked"),
    $("#foresightR").prop("checked"),
  ];
  var isHelpingHand = [
    $("#helpingHandR").prop("checked"),
    $("#helpingHandL").prop("checked"),
  ]; // affects attacks against opposite side
  var isFriendGuard = [
    $("#friendGuardL").prop("checked"),
    $("#friendGuardR").prop("checked"),
  ];
  var isBattery = [
    $("#batteryR").prop("checked"),
    $("#batteryL").prop("checked"),
  ];
  var isPowerSpot = [
    $("#powerSpotR").prop("checked"),
    $("#powerSpotL").prop("checked"),
  ]; // affects attacks against opposite side
  var isTailwind = [
    $("#tailwindL").prop("checked"),
    $("#tailwindR").prop("checked"),
  ];
  var isBeadsOfRuin = $("#beads-of-ruin").prop("checked");
  var isVesselOfRuin = $("#vessel-of-ruin").prop("checked");
  var isTabletsOfRuin = $("#tablets-of-ruin").prop("checked");
  var isSwordOfRuin = $("#sword-of-ruin").prop("checked");

  var isWonderRoom = $("#wonder-room").prop("checked");
  var isMagicRoom = $("#magic-room").prop("checked");

  this.weather = weather;
  this.terrain = terrain;
  // this.isMagicRoom = !!field.isMagicRoom;
  // this.isWonderRoom = !!field.isWonderRoom;
  this.isGravity = !!isGravity;
  this.isAuraBreak = isAuraBreak || false;
  this.isFairyAura = isFairyAura || false;
  this.isDarkAura = isDarkAura || false;

  this.getFormat = function () {
    return format;
  };
  this.getGravity = function () {
    return isGravity;
  };
  this.getAuraBreak = function () {
    return isAuraBreak;
  };
  this.getFairyAura = function () {
    return isFairyAura;
  };
  this.getDarkAura = function () {
    return isDarkAura;
  };
  this.getBeadsOfRuin = function () {
    return isBeadsOfRuin;
  };
  this.getVesselOfRuin = function () {
    return isVesselOfRuin;
  };
  this.getTabletsOfRuin = function () {
    return isTabletsOfRuin;
  };
  this.getSwordOfRuin = function () {
    return isSwordOfRuin;
  };
  this.getWonderRoom = function () {
    return isWonderRoom;
  };
  this.getMagicRoom = function () {
    return isMagicRoom;
  };
  this.getWeather = function () {
    return weather;
  };
  this.getTerrain = function () {
    return terrain;
  };
  this.clearWeather = function () {
    weather = "";
  };
  this.getFieldForDamage = function (i) {
    return {
      weather: this.getWeather(),
      terrain: this.getTerrain(),
      gameType: this.getFormat(),
      isGravity: this.getGravity(),
      isAuraBreak: this.getAuraBreak(),
      isFairyAura: this.getFairyAura(),
      isDarkAura: this.getDarkAura(),
      isBeadsOfRuin: this.getBeadsOfRuin(),
      isVesselOfRuin: this.getVesselOfRuin(),
      isTabletsOfRuin: this.getTabletsOfRuin(),
      isSwordOfRuin: this.getSwordOfRuin(),
      isWonderRoom: this.getWonderRoom(),
      isMagicRoom: this.getMagicRoom(),
    };
  };
  this.getSide = function (i) {
    return new Side(
      format,
      terrain,
      weather,
      isGravity,
      isSR[+!i],
      spikes[+!i],
      isReflect[i],
      isLightScreen[i],
      isAuroraVeil[i],
      isForesight[i],
      isHelpingHand[+!i],
      isFriendGuard[i],
      isBattery[i],
      isProtect[i],
      isPowerSpot[i],
      isTailwind[i]
    );
  };
}

function Side(
  format,
  terrain,
  weather,
  isGravity,
  isSR,
  spikes,
  isReflect,
  isLightScreen,
  isAuroraVeil,
  isForesight,
  isHelpingHand,
  isFriendGuard,
  isBattery,
  isProtect,
  isPowerSpot,
  isTailwind
) {
  this.gameType = format;
  this.terrain = terrain;
  this.weather = weather;
  this.isGravity = isGravity;
  this.isSR = isSR;
  this.spikes = spikes;
  this.isReflect = isReflect;
  this.isLightScreen = isLightScreen;
  this.isAuroraVeil = isAuroraVeil;
  this.isForesight = isForesight;
  this.isHelpingHand = isHelpingHand;
  this.isFriendGuard = isFriendGuard;
  this.isBattery = isBattery;
  this.isProtected = isProtect;
  this.isPowerSpot = isPowerSpot;
  this.isTailwind = isTailwind;
  this.isBeadsOfRuin;
}

var gen,
  pokedex,
  setdex,
  typeChart,
  moves,
  abilities,
  items,
  STATS,
  calculateAllMoves,
  calcHP,
  calcStat;

$(".gen").change(function () {
  gen = ~~$(this).val();
  switch (gen) {
    case 1:
      pokedex = POKEDEX_RBY;
      setdex = SETDEX_RBY;
      typeChart = TYPE_CHART_RBY;
      moves = MOVES_RBY;
      items = [];
      abilities = [];
      STATS = STATS_RBY;
      calculateAllMoves = CALCULATE_ALL_MOVES_RBY;
      calcHP = CALC_HP_RBY;
      calcStat = CALC_STAT_RBY;
      break;
    case 2:
      pokedex = POKEDEX_GSC;
      setdex = SETDEX_GSC;
      typeChart = TYPE_CHART_GSC;
      moves = MOVES_GSC;
      items = ITEMS_GSC;
      abilities = [];
      STATS = STATS_GSC;
      calculateAllMoves = CALCULATE_ALL_MOVES_GSC;
      calcHP = CALC_HP_RBY;
      calcStat = CALC_STAT_RBY;
      break;
    case 3:
      pokedex = POKEDEX_ADV;
      setdex = SETDEX_ADV;
      typeChart = TYPE_CHART_GSC;
      moves = MOVES_ADV;
      items = ITEMS_ADV;
      abilities = ABILITIES_ADV;
      STATS = STATS_GSC;
      calculateAllMoves = CALCULATE_ALL_MOVES_ADV;
      calcHP = CALC_HP_ADV;
      calcStat = CALC_STAT_ADV;
      break;
    case 4:
      pokedex = POKEDEX_DPP;
      setdex = SETDEX_DPP;
      typeChart = TYPE_CHART_GSC;
      moves = MOVES_DPP;
      items = ITEMS_DPP;
      abilities = ABILITIES_DPP;
      STATS = STATS_GSC;
      calculateAllMoves = CALCULATE_ALL_MOVES_DPP;
      calcHP = CALC_HP_ADV;
      calcStat = CALC_STAT_ADV;
      break;
    case 5:
      pokedex = POKEDEX_BW;
      setdex = SETDEX_BW;
      typeChart = TYPE_CHART_GSC;
      moves = MOVES_BW;
      items = ITEMS_BW;
      abilities = ABILITIES_BW;
      STATS = STATS_GSC;
      calculateAllMoves = CALCULATE_ALL_MOVES_BW;
      calcHP = CALC_HP_ADV;
      calcStat = CALC_STAT_ADV;
      break;
    case 6:
      pokedex = POKEDEX_XY;
      setdex = SETDEX_XY;
      typeChart = TYPE_CHART_XY;
      moves = MOVES_XY;
      items = ITEMS_XY;
      abilities = ABILITIES_XY;
      STATS = STATS_GSC;
      calculateAllMoves = CALCULATE_ALL_MOVES_XY;
      calcHP = CALC_HP_ADV;
      calcStat = CALC_STAT_ADV;
      break;
    case 7:
      pokedex = POKEDEX_SM;
      setdex = SETDEX_SM;
      typeChart = TYPE_CHART_XY;
      moves = MOVES_SM;
      items = ITEMS_SM;
      abilities = ABILITIES_SM;
      STATS = STATS_GSC;
      calculateAllMoves = CALCULATE_ALL_MOVES_SM;
      calcHP = CALC_HP_ADV;
      calcStat = CALC_STAT_ADV;
      break;
    case 8:
      pokedex = POKEDEX_SS;
      setdex = SETDEX_SS;
      typeChart = TYPE_CHART_XY;
      moves = MOVES_SS;
      items = ITEMS_SS;
      abilities = ABILITIES_SS;
      STATS = STATS_GSC;
      calculateAllMoves = CALCULATE_ALL_MOVES_SM;
      calcHP = CALC_HP_ADV;
      calcStat = CALC_STAT_ADV;
      break;
    case 9:
      pokedex = POKEDEX_SS;
      setdex = SETDEX_SS;
      typeChart = TYPE_CHART_XY;
      moves = MOVES_SV;
      items = ITEMS_SV;
      abilities = ABILITIES_SV;
      STATS = STATS_GSC;
      calculateAllMoves = CALCULATE_ALL_MOVES_SM;
      calcHP = CALC_HP_ADV;
      calcStat = CALC_STAT_ADV;
      break;
  }
  clearField();
  $(".gen-specific.g" + gen).show();
  $(".gen-specific")
    .not(".g" + gen)
    .hide();
  var typeOptions = getSelectOptions(Object.keys(typeChart));
  $("select.type1, select.move-type")
    .find("option")
    .remove()
    .end()
    .append(typeOptions);
  $("select.type2")
    .find("option")
    .remove()
    .end()
    .append('<option value="">(none)</option>' + typeOptions);
  $("select.teraType")
    .find("option")
    .remove()
    .end()
    .append(
      '<option value="" selected>(none)</option>' +
        typeOptions.replace('selected="selected"', "")
    );
  var moveOptions = getSelectOptions(Object.keys(moves), true);
  $("select.move-selector").find("option").remove().end().append(moveOptions);
  var abilityOptions = getSelectOptions(abilities, true);
  $("select.ability")
    .find("option")
    .remove()
    .end()
    .append('<option value="">(other)</option>' + abilityOptions);
  var itemOptions = getSelectOptions(items, true);
  $("select.item")
    .find("option")
    .remove()
    .end()
    .append('<option value="">(none)</option>' + itemOptions);

  $(".set-selector").val(getSetOptions()[gen > 3 ? 1 : gen === 1 ? 5 : 3].id);
  $(".set-selector").change();
});

function clearField() {
  $("#doubles").prop("checked", true);
  $("#clear").prop("checked", true);
  $("#gscClear").prop("checked", true);
  $("#gravity").prop("checked", false);
  $("#srL").prop("checked", false);
  $("#srR").prop("checked", false);
  $("#spikesL0").prop("checked", true);
  $("#spikesR0").prop("checked", true);
  $("#gscSpikesL").prop("checked", false);
  $("#gscSpikesR").prop("checked", false);
  $("#reflectL").prop("checked", false);
  $("#reflectR").prop("checked", false);
  $("#lightScreenL").prop("checked", false);
  $("#lightScreenR").prop("checked", false);
  $("#auroraVeilL").prop("checked", false);
  $("#auroraVeilR").prop("checked", false);
  $("#foresightL").prop("checked", false);
  $("#foresightR").prop("checked", false);
  $("#helpingHandL").prop("checked", false);
  $("#helpingHandR").prop("checked", false);
  $("#friendGuardL").prop("checked", false);
  $("#friendGuardR").prop("checked", false);
  $("#tailwindL").prop("checked", false);
  $("#tailwindR").prop("checked", false);
}

function getSetOptions() {
  var pokeNames, index;
  pokeNames = Object.keys(pokedex);
  index = pokeNames.length;
  while (index--) {
    if (pokedex[pokeNames[index]].isAlternateForme) {
      pokeNames.splice(index, 1);
    }
  }
  pokeNames.sort();
  index = pokeNames.length;
  while (index--) {
    //forcing alolan forms to show first
    if (pokeNames[index].includes("-Alola")) {
      var temp = pokeNames[index];
      pokeNames.splice(index, 1); //deleting alolan entry
      var regularForm = temp.substring(0, temp.indexOf("-Alola"));
      var regularIndex = pokeNames.indexOf(regularForm);
      pokeNames.splice(regularIndex, 0, temp); //re-inserting it right before non-alolan entry
    }
  }
  var setOptions = [];
  var idNum = 0;
  for (var i = 0; i < pokeNames.length; i++) {
    var pokeName = pokeNames[i];
    setOptions.push({
      pokemon: pokeName,
      text: pokeName,
    });
    if (pokeName in setdex) {
      var setNames = Object.keys(setdex[pokeName]);
      for (var j = 0; j < setNames.length; j++) {
        var setName = setNames[j];
        setOptions.push({
          pokemon: pokeName,
          set: setName,
          text: pokeName + " (" + setName + ")",
          id: pokeName + " (" + setName + ")",
        });
      }
    }
    setOptions.push({
      pokemon: pokeName,
      set: "Blank Set",
      text: pokeName + " (Blank Set)",
      id: pokeName + " (Blank Set)",
    });
  }
  return setOptions;
}

function getSelectOptions(arr, sort, defaultIdx) {
  if (sort) {
    arr.sort();
  }
  var r = "";
  // Zero is of course falsy too, but this is mostly to coerce undefined.
  if (!defaultIdx) {
    defaultIdx = 0;
  }
  for (var i = 0; i < arr.length; i++) {
    if (i === defaultIdx) {
      r +=
        '<option value="' +
        arr[i] +
        '" selected="selected">' +
        arr[i] +
        "</option>";
    } else {
      r += '<option value="' + arr[i] + '">' + arr[i] + "</option>";
    }
  }
  return r;
}

$(document).ready(function () {
  $("#gen9").prop("checked", true);
  $("#gen9").change();
  $(".terrain-trigger").bind("change keyup", getTerrainEffects);
  $(".calc-trigger").bind("change keyup", calculateAll);
  $(".set-selector").select2({
    formatResult: function (object) {
      return object.set
        ? "&nbsp;&nbsp;&nbsp;" + object.set
        : "<b>" + object.text + "</b>";
    },
    query: function (query) {
      var setOptions = getSetOptions();
      var pageSize = 30;
      var results = [];
      for (var i = 0; i < setOptions.length; i++) {
        var pokeName = setOptions[i].pokemon.toUpperCase();
        if (!query.term || pokeName.indexOf(query.term.toUpperCase()) > -1) {
          results.push(setOptions[i]);
        }
      }
      query.callback({
        results: results.slice(
          (query.page - 1) * pageSize,
          query.page * pageSize
        ),
        more: results.length >= query.page * pageSize,
      });
    },
    initSelection: function (element, callback) {
      var data = getSetOptions()[gen > 3 ? 1 : gen === 1 ? 5 : 3];
      callback(data);
    },
  });
  $(".move-selector").select2({
    dropdownAutoWidth: true,
    matcher: function (term, text) {
      // 2nd condition is for Hidden Power
      return (
        text.toUpperCase().indexOf(term.toUpperCase()) === 0 ||
        text.toUpperCase().indexOf(" " + term.toUpperCase()) >= 0
      );
    },
  });
  $(".set-selector").val(getSetOptions()[gen > 3 ? 1 : gen === 1 ? 5 : 3].id);
  $(".set-selector").change();

  getPikalyticsSet();

  if (window.location.href.indexOf("attSet=") != -1) {
    getQueryParamSet("attSet", "#p1");
  }
  if (window.location.href.indexOf("defSet=") != -1) {
    getQueryParamSet("defSet", "#p2");
  }
});

/*
    Pikalytics main site set data to localStorage as protag or antag (with set)
    Load here on init
    Set object looks like this:
    ability: "Snow Warning"
    evs: {
        at: 4
        df: 0
        hp: 252
        sa: 252
        sd: 0
        sp: 0
    }
    item: ""
    level: 50
    moves: ["Blizzard",
            "Ice Shard",
            "Energy Ball",
            "Giga Drain"]
    nature: "Quiet"
*/

$(".result-move").change(function () {
  if (damageResults) {
    var result = findDamageResult($(this));
    if (result) {
      $("#mainResultTitle").html(
        '<span class="sprite-xyicons ' +
          result.description.p1.toLowerCase() +
          ' inline-block" style="margin-left:0px;margin-right:20px;position:relative;top:7px;"></span>' +
          '<span style="font-weight:bold;">' +
          result.description.p1 +
          "</span>" +
          ' <span style="font-size:12px;vertical-align:middle;margin-left:5px;">(' +
          result.description.msg
            .split(" vs. ")[0]
            .replace(result.description.p1, "")
            .replace(result.description.move, "") +
          ")</span>" +
          '<span style="margin-left:10px;"> vs. </span>' +
          '<span class="sprite-xyicons ' +
          result.description.p2.toLowerCase() +
          ' inline-block" style="margin-left:10px;margin-right:20px;position:relative;top:7px;"></span>' +
          '<span style="font-weight:bold;">' +
          result.description.p2 +
          "</span>" +
          ' <span style="font-size:12px;vertical-align:middle;margin-left:5px;">(' +
          result.description.msg
            .split(" vs. ")[1]
            .replace(result.description.p2, "")
            .split(":")[0] +
          ")</span>"
      );
      $("#mainResultMove").html(
        result.description.move +
          '<span class="type ' +
          result.description.moveType +
          '" style="margin-left:10px;">' +
          result.description.moveType +
          "</span>"
      );
      $("#mainResultDamage").html(result.damageText);
      $("#mainResultKO").html(result.koChanceText);
      $("#damageValues").text("(" + result.damage.join(", ") + ")");
    }
  }
});

var last_poke = "";
function getPikalyticsSet() {
  var lsResult = JSON.parse(localStorage.getItem("damageCalcAtt"));
  getSetFromPikalyticsStructure(lsResult, "#p1", "(Pikalytics Team Builder)");
}

function getQueryParamSet(key, player) {
  var url = new URL(window.location.href);
  var set = url.searchParams.get(key);
  if (set) {
    console.log(window.atob(window.decodeURI(set)));
    getSetFromPikalyticsStructure(
      JSON.parse(window.atob(window.decodeURI(set))),
      player,
      "(Imported from link)"
    );
  }
}

function getSetFromPikalyticsStructure(inputSet, player, sourceType) {
  var pokemonName, setName;
  if (inputSet != false && inputSet != null) {
    pokemonName = inputSet.name;
    for (var i = 0; i < showdownFormes.length; ++i) {
      if (pokemonName == showdownFormes[i][0])
        pokemonName = showdownFormes[i][1];
    }
    var pokemon = pokedex[pokemonName];
    if (pokemon) {
      var pokeObj = $(player);
      $(player + " .select2-chosen").text(pokemonName + " " + sourceType);
      $(player + " .set-selector").val(pokemonName + " " + sourceType);
      pokeObj.find(".type1").val(pokemon.t1);
      pokeObj.find(".type2").val(pokemon.t2);
      pokeObj.find(".hp .base").val(pokemon.bs.hp);
      var i;
      for (i = 0; i < STATS.length; i++) {
        pokeObj.find("." + STATS[i] + " .base").val(pokemon.bs[STATS[i]]);
      }
      pokeObj.find(".weight").val(pokemon.w);
      pokeObj.find(".boost").val(0);
      pokeObj.find(".percent-hp").val(100);
      pokeObj.find(".status").val("Healthy");
      $(".status").change();
      var moveObj;
      var abilityObj = pokeObj.find(".ability");
      var itemObj = pokeObj.find(".item");
      var formeObj = pokeObj.find(".forme");
      if (typeof inputSet.set != "undefined") {
        var set = inputSet.set;
        pokeObj.find(".level").val(set.level);
        pokeObj
          .find(".hp .evs")
          .val(set.evs && typeof set.evs.hp !== "undefined" ? set.evs.hp : 0);
        pokeObj
          .find(".hp .ivs")
          .val(set.ivs && typeof set.ivs.hp !== "undefined" ? set.ivs.hp : 31);
        pokeObj
          .find(".hp .dvs")
          .val(set.dvs && typeof set.dvs.hp !== "undefined" ? set.dvs.hp : 15);
        for (i = 0; i < STATS.length; i++) {
          pokeObj
            .find("." + STATS[i] + " .evs")
            .val(
              set.evs && typeof set.evs[STATS[i]] !== "undefined"
                ? set.evs[STATS[i]]
                : 0
            );
          pokeObj
            .find("." + STATS[i] + " .dvs")
            .val(
              set.dvs && typeof set.dvs[STATS[i]] !== "undefined"
                ? set.dvs[STATS[i]]
                : 15
            );
        }
        var IV_STATS = ["atk", "def", "spa", "spd", "spe"];
        for (i = 0; i < IV_STATS.length; i++) {
          pokeObj
            .find("." + STATS[i] + " .ivs")
            .val(
              set.ivs && typeof set.ivs[IV_STATS[i]] !== "undefined"
                ? set.ivs[IV_STATS[i]]
                : 31
            );
        }
        setSelectValueIfValid(pokeObj.find(".nature"), set.nature, "Hardy");
        setSelectValueIfValid(abilityObj, set.ability || pokemon.ab, "");
        setSelectValueIfValid(itemObj, set.item, "");
        for (i = 0; i < 4; i++) {
          moveObj = pokeObj.find(".move" + (i + 1) + " select.move-selector");
          setSelectValueIfValid(moveObj, set.moves[i], "(No Move)");
          moveObj.change();
        }
      } else {
        pokeObj.find(".level").val(100);
        pokeObj.find(".hp .evs").val(0);
        pokeObj.find(".hp .ivs").val(31);
        pokeObj.find(".hp .dvs").val(15);
        for (i = 0; i < STATS.length; i++) {
          pokeObj.find("." + STATS[i] + " .evs").val(0);
          pokeObj.find("." + STATS[i] + " .ivs").val(31);
          pokeObj.find("." + STATS[i] + " .dvs").val(15);
        }
        pokeObj.find(".nature").val("Hardy");
        setSelectValueIfValid(abilityObj, pokemon.ab, "");
        itemObj.val("");
        for (i = 0; i < 4; i++) {
          moveObj = pokeObj.find(".move" + (i + 1) + " select.move-selector");
          moveObj.val("(No Move)");
          moveObj.change();
        }
      }
      calcHP(pokeObj);
      calcStats(pokeObj);
      abilityObj.change();
      itemObj.change();

      formeObj.empty();
      formeObj.append(
        '<option value="' + pokemonName + '">' + pokemonName + "</option>"
      );
      setSelectValueIfValid(formeObj, pokemonName, "");
      formeObj.change();

      $(player + " .move-hits").remove();

      var poke_ga_string = pokemonName;
      if (last_poke != poke_ga_string) {
        last_poke = poke_ga_string;
      }
    }
  }

  localStorage.removeItem("damageCalcAtt");
  calculateAll();
}

function checkMoveUICases(moveName, moveInfo, pokeInfo, field) {
  setTimeout(() => {
    checkSurgingStrikes(moveName, moveInfo);
    checkTripleAxel(moveName, moveInfo);
    checkElectroBall(moveName, moveInfo, pokeInfo);
    checkWeatherBall(moveName, moveInfo, pokeInfo, field);
  }, 0);
}

function checkElectroBall(moveName, moveInfo, pokeInfo) {
  if (moveName != "Electro Ball") return;
  let r;
  if (pokeInfo.selector == "#p1") {
    r = Math.floor(
      parseInt($("#p1_speed_calc").text()) /
        parseInt($("#p2_speed_calc").text())
    );
  } else {
    r = Math.floor(
      parseInt($("#p2_speed_calc").text()) /
        parseInt($("#p1_speed_calc").text())
    );
  }
  basePower = r >= 4 ? 150 : r >= 3 ? 120 : r >= 2 ? 80 : r >= 1 ? 60 : 40;
  moveInfo.find(".move-bp").val(basePower);
}

function checkWeatherBall(moveName, moveInfo, pokeInfo, field) {
  if (moveName != "Weather Ball") return;
  if (field === undefined) return;
  let moveType;
  const weather = field.getWeather();
  switch (weather) {
    case "Snow":
      moveType = "Ice";
      break;
    case "Sand":
      moveType = "Rock";
      break;
    case "Rain":
      moveType = "Water";
      break;
    case "Heavy Rain":
      moveType = "Water";
      break;
    case "Sun":
      moveType = "Fire";
      break;
    case "Harsh Sunshine":
      moveType = "Fire";
      break;
    default:
      moveType = "Normal";
      break;
  }

  if (moveType != "Normal") {
    moveInfo.find(".move-bp").val(100);
  } else {
    moveInfo.find(".move-bp").val(50);
  }
  moveInfo.find(".move-type").val(moveType);
}

function checkSurgingStrikes(moveName, moveInfo) {
  if (moveName == "Surging Strikes") ~~moveInfo.find(".move-hits").val(3);
}

function checkTripleAxel(moveName, moveInfo) {
  if (moveName == "Triple Axel")
    ~~moveInfo
      .find(".move-hits")
      .val(Math.min(~~moveInfo.find(".move-hits").val(), 3));
}
