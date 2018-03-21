use strict;
use warnings;
use LWP;
use Data::Dumper;
use XML::LibXML;

my $ua = LWP::UserAgent->new;
#a = []; $("dt a").each((i,e) => {if($(e).attr("href").match("wiki")){a.push("'https://ja.wikipedia.org" + $(e).attr("href") + "',")}}); a.join("\r\n");
my @links = (
'https://ja.wikipedia.org/wiki/%E9%99%BD%E7%82%8E_(%E9%99%BD%E7%82%8E%E5%9E%8B%E9%A7%86%E9%80%90%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E4%B8%8D%E7%9F%A5%E7%81%AB_(%E9%99%BD%E7%82%8E%E5%9E%8B%E9%A7%86%E9%80%90%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E9%BB%92%E6%BD%AE_(%E9%A7%86%E9%80%90%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E8%A6%AA%E6%BD%AE_(%E9%A7%86%E9%80%90%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E6%97%A9%E6%BD%AE_(%E9%A7%86%E9%80%90%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E5%A4%8F%E6%BD%AE_(%E9%A7%86%E9%80%90%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E5%88%9D%E9%A2%A8_(%E9%A7%86%E9%80%90%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E9%9B%AA%E9%A2%A8_(%E9%A7%86%E9%80%90%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E5%A4%A9%E6%B4%A5%E9%A2%A8_(%E9%99%BD%E7%82%8E%E5%9E%8B%E9%A7%86%E9%80%90%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E6%99%82%E6%B4%A5%E9%A2%A8_(%E9%99%BD%E7%82%8E%E5%9E%8B%E9%A7%86%E9%80%90%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E6%B5%A6%E9%A2%A8_(%E9%99%BD%E7%82%8E%E5%9E%8B%E9%A7%86%E9%80%90%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E7%A3%AF%E9%A2%A8_(%E9%99%BD%E7%82%8E%E5%9E%8B%E9%A7%86%E9%80%90%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E6%B5%9C%E9%A2%A8_(%E9%99%BD%E7%82%8E%E5%9E%8B%E9%A7%86%E9%80%90%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E8%B0%B7%E9%A2%A8_(%E9%99%BD%E7%82%8E%E5%9E%8B%E9%A7%86%E9%80%90%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E9%87%8E%E5%88%86_(%E9%99%BD%E7%82%8E%E5%9E%8B%E9%A7%86%E9%80%90%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E5%B5%90_(%E9%A7%86%E9%80%90%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E8%90%A9%E9%A2%A8_(%E9%A7%86%E9%80%90%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E8%88%9E%E9%A2%A8_(%E9%A7%86%E9%80%90%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E7%A7%8B%E9%9B%B2_(%E9%A7%86%E9%80%90%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E9%A7%86%E9%80%90%E8%89%A6%E9%9B%AA%E9%A2%A8_(%E6%98%A0%E7%94%BB)',
'https://ja.wikipedia.org/wiki/%E3%83%8F%E3%82%A4%E3%82%B9%E3%82%AF%E3%83%BC%E3%83%AB%E3%83%BB%E3%83%95%E3%83%AA%E3%83%BC%E3%83%88',
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
