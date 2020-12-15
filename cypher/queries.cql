MATCH (e{name:'eslint'})
CALL apoc.path.subgraphNodes(e, {}) YIELD node as connected
return
sum(
	CASE connected
    when connected is NULL
    then 0
    else 1 end
) as count;

MATCH (a)-[r:DEPENDS_ON]->(b)
return a, count(r) as count
order by count desc
limit 10;

MATCH (a:PACKAGE)
where a.repo CONTAINS 'github'
RETURN count(a);



