use strict;
use warnings;
use LWP;
use Data::Dumper;

my $ua = LWP::UserAgent->new;
#a = []; $("dt a").each((i,e) => {if($(e).attr("href").match("wiki")){a.push("'https://ja.wikipedia.org" + $(e).attr("href") + "',")}}); a.join("\r\n");
my @links = (
'https://ja.wikipedia.org/wiki/%E5%A4%A9%E9%BE%8D%E5%9E%8B%E8%BB%BD%E5%B7%A1%E6%B4%8B%E8%89%A6',
'https://ja.wikipedia.org/wiki/%E5%A4%A9%E9%BE%8D_(%E8%BB%BD%E5%B7%A1%E6%B4%8B%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E9%BE%8D%E7%94%B0_(%E8%BB%BD%E5%B7%A1%E6%B4%8B%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E7%90%83%E7%A3%A8%E5%9E%8B%E8%BB%BD%E5%B7%A1%E6%B4%8B%E8%89%A6',
'https://ja.wikipedia.org/wiki/%E7%90%83%E7%A3%A8_(%E8%BB%BD%E5%B7%A1%E6%B4%8B%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E5%A4%9A%E6%91%A9_(%E8%BB%BD%E5%B7%A1%E6%B4%8B%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E5%8C%97%E4%B8%8A_(%E8%BB%BD%E5%B7%A1%E6%B4%8B%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E5%A4%A7%E4%BA%95_(%E8%BB%BD%E5%B7%A1%E6%B4%8B%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E6%9C%A8%E6%9B%BE_(%E8%BB%BD%E5%B7%A1%E6%B4%8B%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E9%95%B7%E8%89%AF%E5%9E%8B%E8%BB%BD%E5%B7%A1%E6%B4%8B%E8%89%A6',
'https://ja.wikipedia.org/wiki/%E9%95%B7%E8%89%AF_(%E8%BB%BD%E5%B7%A1%E6%B4%8B%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E4%BA%94%E5%8D%81%E9%88%B4_(%E8%BB%BD%E5%B7%A1%E6%B4%8B%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E5%90%8D%E5%8F%96_(%E8%BB%BD%E5%B7%A1%E6%B4%8B%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E7%94%B1%E8%89%AF_(%E8%BB%BD%E5%B7%A1%E6%B4%8B%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E9%AC%BC%E6%80%92_(%E8%BB%BD%E5%B7%A1%E6%B4%8B%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E9%98%BF%E6%AD%A6%E9%9A%88_(%E8%BB%BD%E5%B7%A1%E6%B4%8B%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E5%B7%9D%E5%86%85%E5%9E%8B%E8%BB%BD%E5%B7%A1%E6%B4%8B%E8%89%A6',
'https://ja.wikipedia.org/wiki/%E5%B7%9D%E5%86%85_(%E8%BB%BD%E5%B7%A1%E6%B4%8B%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E7%A5%9E%E9%80%9A_(%E8%BB%BD%E5%B7%A1%E6%B4%8B%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E9%82%A3%E7%8F%82_(%E8%BB%BD%E5%B7%A1%E6%B4%8B%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E5%A4%95%E5%BC%B5_(%E8%BB%BD%E5%B7%A1%E6%B4%8B%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E5%A4%95%E5%BC%B5_(%E8%BB%BD%E5%B7%A1%E6%B4%8B%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E6%9C%80%E4%B8%8A%E5%9E%8B%E9%87%8D%E5%B7%A1%E6%B4%8B%E8%89%A6',
'https://ja.wikipedia.org/wiki/%E6%9C%80%E4%B8%8A_(%E9%87%8D%E5%B7%A1%E6%B4%8B%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E4%B8%89%E9%9A%88_(%E9%87%8D%E5%B7%A1%E6%B4%8B%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E9%88%B4%E8%B0%B7_(%E9%87%8D%E5%B7%A1%E6%B4%8B%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E7%86%8A%E9%87%8E_(%E9%87%8D%E5%B7%A1%E6%B4%8B%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E9%98%BF%E8%B3%80%E9%87%8E%E5%9E%8B%E8%BB%BD%E5%B7%A1%E6%B4%8B%E8%89%A6',
'https://ja.wikipedia.org/wiki/%E9%98%BF%E8%B3%80%E9%87%8E_(%E8%BB%BD%E5%B7%A1%E6%B4%8B%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E8%83%BD%E4%BB%A3_(%E8%BB%BD%E5%B7%A1%E6%B4%8B%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E7%9F%A2%E7%9F%A7_(%E8%BB%BD%E5%B7%A1%E6%B4%8B%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E9%85%92%E5%8C%82_(%E8%BB%BD%E5%B7%A1%E6%B4%8B%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E5%A4%A7%E6%B7%80_(%E8%BB%BD%E5%B7%A1%E6%B4%8B%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E5%A4%A7%E6%B7%80_(%E8%BB%BD%E5%B7%A1%E6%B4%8B%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E9%A6%99%E5%8F%96%E5%9E%8B%E7%B7%B4%E7%BF%92%E5%B7%A1%E6%B4%8B%E8%89%A6',
'https://ja.wikipedia.org/wiki/%E9%A6%99%E5%8F%96_(%E7%B7%B4%E7%BF%92%E5%B7%A1%E6%B4%8B%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E9%B9%BF%E5%B3%B6_(%E7%B7%B4%E7%BF%92%E5%B7%A1%E6%B4%8B%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E9%A6%99%E6%A4%8E_(%E7%B7%B4%E7%BF%92%E5%B7%A1%E6%B4%8B%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E5%AF%A7%E6%B5%B7%E7%B4%9A%E5%B7%A1%E6%B4%8B%E8%89%A6',
'https://ja.wikipedia.org/wiki/%E5%B9%B3%E6%B5%B7_(%E5%B7%A1%E6%B4%8B%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E6%94%B9%E9%98%BF%E8%B3%80%E9%87%8E%E5%9E%8B%E8%BB%BD%E5%B7%A1%E6%B4%8B%E8%89%A6',
'https://ja.wikipedia.org/wiki/%E3%83%9E%E3%83%AB5%E8%A8%88%E7%94%BB',
'https://ja.wikipedia.org/wiki/%E6%94%B9%E3%83%9E%E3%83%AB5%E8%A8%88%E7%94%BB',
'https://ja.wikipedia.org/wiki/815%E5%8F%B7%E5%9E%8B%E8%BB%BD%E5%B7%A1%E6%B4%8B%E8%89%A6',
);

foreach my $link (@links) {
	my $req = HTTP::Request->new(GET => $link);
	my $rsp = $ua->request($req);
	my $txt = $rsp->content; # 年3月16日
	# if ($txt =~ /進水<\/td>(?:\n|\r)?<td>[^\r\n]+(\d+)年[^\r\n]+(\d+)月[^\r\n]+(\d+)日/) {
		print "nope\n" if $rsp->is_error();
	# }
	# die;
	my ($y, $m, $d) = $txt =~ /進水<\/t(?:d|h)>[\r\n]*?<td[^\r\n]*?(\d+)年[^\r\n]*?(\d+)月[^\r\n]*?(\d+)日/;
	my ($n) = $txt =~ /id="firstHeading"[^\/<]+>([^\/>]+)</;
	 # $dt =~ /(\d+)\x{5e74}(\d+)\x{6708}(\d+)\x{65e5}/;
	# print $y; die;
	print {*STDOUT} qq({"name" : "$n", "year" : ") . ($y // "") . qq(", "month" : ") . ($m // "") . qq(", "day" : ") . ($d // "") . qq("},\n);
}
