<?php
header('Access-Control-Allow-Origin: *');
error_reporting(0);
ini_set('display_errors', 0);
$random = json_decode(file_get_contents("./saved.json"), true);
$saverandom = $random;
$data = array();
$data["data"] = array();
while (count($data["data"]) < 10) {
	$newdata = json_decode(file_get_contents("https://inspirobot.me/api/?generateFlow=1&sessionID=" . $_GET["s"]), true);
	$a = 0;
	while ($a < count($newdata["data"])) {
		$data["data"][count($data["data"])] = $newdata["data"][$a];
		$a++;
	}
}

if ($_GET["r"] != "") {
	$rvalues = explode("-", $_GET["r"]);
	$i = 0;
	while ($i < count($rvalues)) {
		if ($rvalues[$i] != "false" && $rvalues[$i] != "") {
			$testkey = intval($rvalues[$i]);
			$saverandom[$testkey]["views"]++;
		}
		$i++;
	}
}






$i = 0;
$number = rand(0, count($random) - 1);
$data["data"][count($data["data"])]["text"] = $random[$number]["quote"];
$keys = array();
while ($i < count($saverandom)) {
	$keys[count($keys)] = $saverandom[$i]["quote"];
	$i++;
}

$i = 0;

while ($i < count($data["data"])) {
	$data["data"][$i]["key"] = array_search($data["data"][$i]["text"], $keys);
	if ($data["data"][$i]["key"] == false) {
		$data["data"][$i]["likes"] = 0;
	} else {
		$data["data"][$i]["likes"] = $saverandom[$data["data"][$i]["key"]]["likes"];
	}
	$i++;
}

$i = 0;

$savecount = count($saverandom);
while ($i < $savecount) {
	if ($saverandom[$i]["views"] > 5 && $saverandom[$i]["views"] / 5 > $saverandom[$i]["likes"]) {
		unset($saverandom[$i]);
		$savecount = $savecount - 1;
	} else {
		$i++;
	}
}


echo json_encode($data);
if ($saverandom != $random) {
	file_put_contents("./saved.json", json_encode($saverandom));
}
?>