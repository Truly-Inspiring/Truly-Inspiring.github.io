<?php
	header('Access-Control-Allow-Origin: *');
	error_reporting(0);
	ini_set('display_errors', 0);
	$quotes = json_decode(file_get_contents("saved.json"), true);
	$newquote = base64_decode($_GET["s"]);
	$i = 0;
	$found = 0;
	echo "new quote: " . $newquote;
	while ($i < count($quotes)) {
		if ($quotes[$i]["quote"] == $newquote) {
			$found = 1;
			$key = $i;
			$i = count($quotes);
		}
		$i++;
	}
	if (!$found) {
		$quotes[count($quotes)]["quote"] = $newquote;
		$quotes[count($quotes) - 1]["likes"] = 1;
		$quotes[count($quotes) - 1]["views"] = 1;
		file_put_contents("saved.json", json_encode($quotes));
	} else {
		//$key = array_search($newquote, $quotes);
		$quotes[intval($key)]["likes"]++;
		file_put_contents("saved.json", json_encode($quotes));
	}
?>