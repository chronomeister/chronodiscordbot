use strict;
use warnings;
use LWP;
use Data::Dumper;

my $ua = LWP::UserAgent->new;
#a = []; $("dt a").each((i,e) => {if($(e).attr("href").match("wiki")){a.push("'https://ja.wikipedia.org" + $(e).attr("href") + "',")}}); a.join("\r\n");
my @links = (
'https://ja.wikipedia.org/wiki/%E5%AF%8C%E5%A3%AB_(%E6%88%A6%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E5%AE%97%E8%B0%B7_(%E8%88%B9)',
'https://ja.wikipedia.org/wiki/%E8%8B%A5%E5%AE%AE_(%E6%B0%B4%E4%B8%8A%E6%A9%9F%E6%AF%8D%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E9%AB%98%E5%B4%8E_(%E9%81%8B%E9%80%81%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E6%9D%BE%E6%B1%9F_(%E6%B5%B7%E9%98%B2%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E9%9D%92%E5%B3%B6_(%E9%81%8B%E9%80%81%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E5%8A%B4%E5%B1%B1_(%E9%81%8B%E9%80%81%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E8%86%A0%E5%B7%9E_(%E6%B8%AC%E9%87%8F%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E5%BF%97%E8%87%AA%E5%B2%90_(%E7%B5%A6%E6%B2%B9%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E6%B4%B2%E5%9F%BC_(%E7%B5%A6%E6%B2%B9%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E5%89%A3%E5%9F%BC_(%E7%B5%A6%E6%B2%B9%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E9%87%8E%E9%96%93_(%E7%B5%A6%E6%B2%B9%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E7%A5%9E%E5%A8%81_(%E6%B0%B4%E4%B8%8A%E6%A9%9F%E6%AF%8D%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E9%A2%A8%E6%97%A9_(%E7%B5%A6%E6%B2%B9%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E9%87%9D%E5%B0%BE_(%E7%B5%A6%E6%B2%B9%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E8%83%BD%E7%99%BB%E5%91%82_(%E6%B0%B4%E4%B8%8A%E6%A9%9F%E6%AF%8D%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E7%9F%A5%E5%BA%8A_(%E7%B5%A6%E6%B2%B9%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E8%A5%9F%E8%A3%B3_(%E7%B5%A6%E6%B2%B9%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E4%BD%90%E5%A4%9A_(%E7%B5%A6%E6%B2%B9%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E9%B6%B4%E8%A6%8B_(%E7%B5%A6%E6%B2%B9%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E5%B0%BB%E7%9F%A2_(%E7%B5%A6%E6%B2%B9%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E7%9F%B3%E5%BB%8A_(%E7%B5%A6%E6%B2%B9%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E9%9A%A0%E6%88%B8_(%E7%B5%A6%E6%B2%B9%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E6%97%A9%E9%9E%86_(%E7%B5%A6%E6%B2%B9%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E9%B3%B4%E6%88%B8_(%E7%B5%A6%E6%B2%B9%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E6%B4%B2%E5%9F%BC_(%E8%BB%BD%E8%B3%AA%E6%B2%B9%E9%81%8B%E6%90%AC%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E9%AB%98%E5%B4%8E_(%E8%BB%BD%E8%B3%AA%E6%B2%B9%E9%81%8B%E6%90%AC%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E8%B6%B3%E6%91%BA_(%E8%BB%BD%E8%B3%AA%E6%B2%B9%E9%81%8B%E6%90%AC%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E5%A1%A9%E5%B1%8B_(%E8%BB%BD%E8%B3%AA%E6%B2%B9%E9%81%8B%E6%90%AC%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E5%A4%A7%E7%80%AC_(%E7%B5%A6%E6%B2%B9%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E5%AE%A4%E6%88%B8_(%E7%B5%A6%E7%82%AD%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E9%87%8E%E5%B3%B6_(%E7%B5%A6%E7%82%AD%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E6%A8%AB%E9%87%8E_(%E7%B5%A6%E5%85%B5%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E9%96%93%E5%AE%AE_(%E7%B5%A6%E7%B3%A7%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E4%BC%8A%E8%89%AF%E6%B9%96_(%E7%B5%A6%E7%B3%A7%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E9%87%8E%E5%9F%BC_(%E7%B5%A6%E7%B3%A7%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E9%9E%8D%E5%9F%BC_(%E7%B5%A6%E7%B3%A7%E8%89%A6)',
'https://ja.wikipedia.org/wiki/%E6%9D%B5%E5%9F%BC_(%E7%B5%A6%E7%B3%A7%E8%89%A6)',);

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
	# my ($d, $m, $y) = $txt =~ /Launched:<\/t(?:d|h)>[\r\n]*?<td[^\r\n]*?(\d+) ([A-z]+) [^\r\n]*?(\d+)/;
	# my ($n) = $txt =~ /id="firstHeading"[^\/<]+>([^)]+\)?)<\/h1>/;
	 # $dt =~ /(\d+)\x{5e74}(\d+)\x{6708}(\d+)\x{65e5}/;
	# print $y; die;
	print {*STDOUT} qq({"name" : "$n", "year" : ") . ($y // "") . qq(", "month" : ") . ($m // "") . qq(", "day" : ") . ($d // "") . qq("},\n);
	# die;
}
