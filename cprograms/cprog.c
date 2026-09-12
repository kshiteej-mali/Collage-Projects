#include   <stdio.h>
#include   <string.h>

int main() {
    printf("Hello, What is your name?\n");
    char name[100];
    scanf("%s", name);
    printf("Hello, %s!\n", name);
    return 0;
}  