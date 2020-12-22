<?php
	header('Access-Control-Allow-Origin: *');
	error_reporting(0);
	ini_set('display_errors', 0);
	$data = json_decode(file_get_contents("./saved.json"), true);
	$i = 0;
	$sorted = array();
	$max = 0;
	while ($i < count($data)) {
		if ($data[$i]["likes"] > $max) {
			$max = $data[$i]["likes"];
		}
		$i++;
	}
	$max = 9 - substr($max, -1);

	$i = 0;
	while ($i < count($data)) {
		$data[$i]["likes"] = $data[$i]["likes"] + $max;
		$i++;
	}

	$i = 0;
	while ($i < count($data)) {
		$sub = floor($data[$i]["likes"] / 10);
		$data[$i]["key"] = $i;
		$sorted[$sub][count($sorted[$sub])] = $data[$i];
		$i++;
	}
	$i = 0;
	$keys = array_keys($sorted);
	while ($i < count($keys)) {
		shuffle($sorted[$keys[$i]]);
		$i++;
	}
	//print_r($sorted);

	$i = 0;
	$a = 0;
	$b = 0;
	$final = array();
	while ($i < 20 && $a < count($keys)) {
		$final[$i] = $sorted[$keys[$a]][$b];
		$b++;
		if ($b == count($sorted[$keys[$a]])) {
			$a++;
			$b = 0;
		}
		$i++;
	}
	echo json_encode($final);
?>