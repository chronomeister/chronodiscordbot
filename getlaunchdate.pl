use strict;
use warnings;
use LWP;
use Data::Dumper;

my $ua = LWP::UserAgent->new;
#a = []; $("dt a").each((i,e) => {if($(e).attr("href").match("wiki")){a.push("'https://ja.wikipedia.org" + $(e).attr("href") + "',")}}); a.join("\r\n");
my @links = (
'https://en.wikipedia.org/wiki/Russian_battleship_Gangut_(1911)',
'https://en.wikipedia.org/wiki/Soviet_battleship_Oktyabrskaya_Revolutsiya',
'https://en.wikipedia.org/wiki/Russian_battleship_Petropavlovsk_(1911)',
'https://en.wikipedia.org/wiki/Soviet_battleship_Marat',
'https://en.wikipedia.org/wiki/Soviet_battleship_Volkhov',
'https://en.wikipedia.org/wiki/Russian_battleship_Poltava_(1911)',
'https://en.wikipedia.org/wiki/Soviet_battleship_Frunze',
'https://en.wikipedia.org/wiki/Russian_battleship_Sevastopol_(1911)',
'https://en.wikipedia.org/wiki/Soviet_battleship_Parizhskaya_Kommuna',
);

foreach my $link (@links) {
	my $req = HTTP::Request->new(GET => $link);
	my $rsp = $ua->request($req);
	my $txt = $rsp->content; # 年3月16日
	# if ($txt =~ /進水<\/td>(?:\n|\r)?<td>[^\r\n]+(\d+)年[^\r\n]+(\d+)月[^\r\n]+(\d+)日/) {
		print "nope\n" if $rsp->is_error();
	# }
	# die;
	# my ($y, $m, $d) = $txt =~ /進水<\/t(?:d|h)>[\r\n]*?<td[^\r\n]*?(\d+)年[^\r\n]*?(\d+)月[^\r\n]*?(\d+)日/;
	# my ($n) = $txt =~ /id="firstHeading"[^\/<]+>([^\/>]+)</;
	my ($d, $m, $y) = $txt =~ /Launched:<\/t(?:d|h)>[\r\n]*?<td[^\r\n]*?(\d+) ([A-z]+) [^\r\n]*?(\d+)/;
	my ($n) = $txt =~ /id="firstHeading"[^\/<]+>([^)]+\)?)<\/h1>/;
	 # $dt =~ /(\d+)\x{5e74}(\d+)\x{6708}(\d+)\x{65e5}/;
	# print $y; die;
	print {*STDOUT} qq({"name" : "$n", "year" : ") . ($y // "") . qq(", "month" : ") . ($m // "") . qq(", "day" : ") . ($d // "") . qq("},\n);
	# die;
}
