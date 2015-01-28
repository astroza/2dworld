function log(msg)
{
	logDiv = document.getElementById('console');
	logDiv.innerHTML = msg + '</br>' + logDiv.innerHTML;
}