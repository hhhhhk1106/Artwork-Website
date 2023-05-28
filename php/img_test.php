<?php
if (isset($_POST['imgName'])){
    $filename = $_POST["imgName"];
    $base64 = $_POST["base64"];

    if(strstr($base64, ',')){
        $base64 = explode(',', $base64);
        $base64 = $base64[1];
    }
    
    //TODO: 路径更改；大小处理（如果不能就算了
    $fp= fopen("../image/".$filename, "w");
    $len = fwrite($fp, base64_decode($base64));
    fclose($fp);

    // 缩放 large
    $source = imagecreatefromjpeg("../image/".$filename);
    list($width, $height) = getimagesize("../image/".$filename);
    $height = imagesy($source);
    $newheight = 900;
    $newwidth = $width * 900 / $height;
    // Load
    $target900 = imagecreatetruecolor($newwidth, $newheight);    
    
    imagecopyresampled($target900, $source, 0, 0, 0, 0, $newwidth, $newheight, $width, $height);
    // Output imagejpeg($target);
    header('Content-Type: image/jpeg');
    imagejpeg($target900,'../image/large/'.$filename);
    imagedestroy($target900);

    // medium
    $newheight = 500;
    $newwidth = $width * 500 / $height;
    $target500 = imagecreatetruecolor($newwidth, $newheight);    
    imagecopyresampled($target500, $source, 0, 0, 0, 0, $newwidth, $newheight, $width, $height);
    header('Content-Type: image/jpeg');
    imagejpeg($target500,'../image/medium/'.$filename);
    imagedestroy($target500);

    // small
    $newheight = 200;
    $newwidth = $width * 200 / $height;
    $target200 = imagecreatetruecolor($newwidth, $newheight);    
    imagecopyresampled($target200, $source, 0, 0, 0, 0, $newwidth, $newheight, $width, $height);
    header('Content-Type: image/jpeg');
    imagejpeg($target200,'../image/small/'.$filename);
    imagedestroy($target200);

    // 裁剪正方形
    $short = min($width,$height);
    $delHeight = ($height-$short) / 2;
    $delWidth = ($width-$short) / 2;
    $square = imagecreatetruecolor($short, $short);    
    imagecopy($square, $source, 0, 0, $delWidth, $delHeight, $width, $height);
    header('Content-Type: image/jpeg');
    //imagejpeg($square,'../image/'.'d.jpg');
    //imagedestroy($square);    

    // medium
    $side = 150;
    $target = imagecreatetruecolor($side, $side);    
    imagecopyresampled($target, $square, 0, 0, 0, 0, $side, $side, $short, $short);
    header('Content-Type: image/jpeg');
    imagejpeg($target,'../image/square-medium/'.$filename);
    imagedestroy($target);
    // small
    $side = 75;
    $target = imagecreatetruecolor($side, $side);    
    imagecopyresampled($target, $square, 0, 0, 0, 0, $side, $side, $short, $short);
    header('Content-Type: image/jpeg');
    imagejpeg($target,'../image/square-small/'.$filename);
    imagedestroy($target);
    // tiny
    $side = 35;
    $target = imagecreatetruecolor($side, $side);    
    imagecopyresampled($target, $square, 0, 0, 0, 0, $side, $side, $short, $short);
    header('Content-Type: image/jpeg');
    imagejpeg($target,'../image/square-tiny/'.$filename);
    imagedestroy($target);

    //echo $len .'字节被写入了\n';
    // TODO: 删除Image路径下原图
    unlink("../image/".$filename);
}